import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoginAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.loginAttempts, {
    eager: true,
    nullable: true,
  })
  user: User;

  @Column({ type: 'varchar', length: '45', nullable: true })
  ip?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  @Column({ type: 'boolean', default: false })
  isSuccessful: boolean;
}
