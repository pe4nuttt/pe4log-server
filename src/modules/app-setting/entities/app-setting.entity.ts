import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AppSetting {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'json' })
  value: Record<string, any>;

  @UpdateDateColumn()
  updatedAt?: Date | null;
}
