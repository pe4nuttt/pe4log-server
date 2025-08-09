import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_KEY } from 'src/utils/constants';
import { NewsletterService } from '../newsletter.service';
import { MailService } from 'src/modules/mail/mail.service';
import { SendNewsletterToUserDto } from '../dto/send-newsletter.dto';

@Processor(QUEUE_KEY.SEND_NEWSLETTER)
export class SendNewsletterProcessor extends WorkerHost {
  private logger = new Logger(SendNewsletterProcessor.name);

  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly mailService: MailService,
  ) {
    super();
  }

  async process(job: Job) {
    let res;
    switch (job.name) {
      case 'send-newsletter':
        res = await this.newsletterService.sendNewsletter(job.data);
        return res;

      case 'send-newsletter-to-user':
        const { user, posts } = job.data as SendNewsletterToUserDto;

        res = await this.mailService.sendNewsletterToUser(user, posts);
        return;
      default:
        throw new Error('No job name match');
    }
  }

  @OnWorkerEvent('active')
  onWorkerActive(job: Job) {
    this.logger.log(`Job ${job.id} is now active`);
  }

  @OnWorkerEvent('completed')
  onWorkerComplete(job: Job, result: any) {
    this.logger.log(`Job has been finished: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onWorkerFailed(job: Job, err: any) {
    this.logger.log(`Job has been failed: ${job.id}`);
    this.logger.log({ err });
  }

  @OnWorkerEvent('error')
  onWorkerError(err: any) {
    this.logger.log(`Job has got error: `);
    this.logger.log({ err });
  }
}
