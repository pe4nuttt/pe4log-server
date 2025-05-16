import { ENewsletterSubscriberStatus } from 'src/utils/enums/newsletter.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('newsletter-subscriber')
export class Newsletter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: ENewsletterSubscriberStatus,
    default: ENewsletterSubscriberStatus.PENDING,
  })
  status: ENewsletterSubscriberStatus;

  @Column({ type: 'timestamp', nullable: true })
  subscribedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  unsubscribedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
