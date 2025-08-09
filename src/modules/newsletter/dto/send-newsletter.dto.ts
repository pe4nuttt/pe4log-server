import { Post } from 'src/modules/posts/entities/post.entity';
import { Newsletter } from '../entities/newsletter.entity';

export interface SendNewsletterToUserDto {
  user: Newsletter;
  posts: Post[];
}
