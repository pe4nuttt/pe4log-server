import { Category } from 'src/modules/categories/entities/category.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { EPostStatus } from 'src/utils/enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 512, unique: true, nullable: true })
  slug?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  seoTitle?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  seoDescription?: string;

  @Column({
    type: 'blob',
    nullable: true,
    select: false,
  })
  content?: Buffer;

  @Column({
    type: 'enum',
    enum: EPostStatus,
    default: EPostStatus.DRAFT,
  })
  status: EPostStatus;

  @ManyToOne(() => User, (user) => user.posts, { eager: true, nullable: false })
  author: User;

  @ManyToOne(() => Category, (category) => category.posts, {
    eager: true,
    nullable: true,
  })
  category?: Category | null;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ type: 'date', nullable: true })
  publishedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
