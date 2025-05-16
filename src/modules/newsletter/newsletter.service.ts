import { Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { NewsletterRepository } from './newsletter.repository';
import { ENewsletterSubscriberStatus } from 'src/utils/enums/newsletter.enum';

@Injectable()
export class NewsletterService {
  constructor(private readonly newsletterRepository: NewsletterRepository) {}

  create(createNewsletterDto: CreateNewsletterDto) {
    return 'This action adds a new newsletter';
  }

  findAll() {
    return `This action returns all newsletter`;
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
}
