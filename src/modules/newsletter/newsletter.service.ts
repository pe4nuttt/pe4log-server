import { Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { NewsletterRepository } from './newsletter.repository';
import { ENewsletterSubscriberStatus } from 'src/utils/enums/newsletter.enum';
import { PostRepository } from '../posts/post.repository';
import dayjs from 'dayjs';
import { MailService } from '../mail/mail.service';
import { Newsletter } from './entities/newsletter.entity';
import { Post } from '../posts/entities/post.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { NEWSLETTER_QUEUE_JOB, QUEUE_KEY } from 'src/utils/constants';
import { Queue } from 'bullmq';
import { SendNewsletterToUserDto } from './dto/send-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly newsletterRepository: NewsletterRepository,
    private readonly postRepository: PostRepository,
    private readonly mailService: MailService,
    @InjectQueue(QUEUE_KEY.SEND_NEWSLETTER)
    private readonly sendNewsletterQueue: Queue,
  ) {}

  create(createNewsletterDto: CreateNewsletterDto) {
    return 'This action adds a new newsletter';
  }

  async findAll() {
    return this.newsletterRepository.find({
      where: {
        status: ENewsletterSubscriberStatus.CONFIRMED,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} newsletter`;
  }

  update(id: number, updateNewsletterDto: UpdateNewsletterDto) {
    return `This action updates a #${id} newsletter`;
  }

  remove(id: number) {
    return `This action removes a #${id} newsletter`;
  }

  async subscribeNewsletter(email: string) {
    const existedNewsletter = await this.newsletterRepository.findOne({
      where: {
        email,
      },
    });

    if (existedNewsletter) {
      return existedNewsletter;
    }

    const newsletter = this.newsletterRepository.create({
      email,
      status: ENewsletterSubscriberStatus.PENDING,
    });

    return this.newsletterRepository.save(newsletter);
  }

  async confirmSubscriptionNewsletter(email: string) {
    let newsletter = await this.newsletterRepository.findOne({
      where: {
        email,
      },
    });

    if (!newsletter) {
      newsletter = this.newsletterRepository.create({
        email,
        status: ENewsletterSubscriberStatus.CONFIRMED,
        subscribedAt: new Date(),
      });
    } else if (newsletter.status === ENewsletterSubscriberStatus.CONFIRMED) {
      return newsletter;
    }

    await this.newsletterRepository.save({
      ...newsletter,
      status: ENewsletterSubscriberStatus.CONFIRMED,
      subscribedAt: new Date(),
    });
  }

  getPostForNewsletter() {
    const startDate = dayjs().subtract(1, 'day').toDate();

    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.publishedAt >= :startDate', { startDate })
      .andWhere('post.status = :status', {
        status: 'published',
      })
      .orderBy('post.publishedAt', 'DESC')
      .limit(5)
      .getMany();
  }

  async sendNewsletter(data: any) {
    console.log('Sending newsletter with data:', data);
    const newsletters = await this.findAll();

    const posts = await this.getPostForNewsletter();

    if (newsletters.length === 0 || posts.length === 0) {
      console.log('No users or posts to send newsletter');
      return;
    }

    const BATCH_SIZE = 200;

    for (let i = 0; i <= newsletters.length; i += BATCH_SIZE) {
      const chunk = newsletters.slice(i, i + BATCH_SIZE);

      await Promise.all(
        chunk.map((user) => {
          const jobData: SendNewsletterToUserDto = {
            user: user,
            posts,
          };

          this.sendNewsletterQueue.add(
            NEWSLETTER_QUEUE_JOB.SEND_NEWSLETTER_TO_USER,
            jobData,
            {
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 20000,
              },
            },
          );
        }),
      );
    }
  }

  async sendNewsletterToUser(newsletter: Newsletter, posts: Post[]) {}
}
