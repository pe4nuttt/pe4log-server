import { Module, Provider } from '@nestjs/common';
import { Hocuspocus, Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { POST_HOCUSPOCUS_PREFIX } from 'src/utils/constants';
import { PostRepository } from 'src/modules/posts/post.repository';
import { PostsModule } from 'src/modules/posts/posts.module';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { EHocuspocusEvents } from './hocuspocus.enum';

export const HocuspocuImpl = Symbol('HocuspocuImpl');

const HocuspocusProvider: Provider = {
  provide: HocuspocuImpl,
  useFactory: (postRepository: PostRepository) => {
    const hocuspocus = new Hocuspocus({
      port: parseInt(process.env.HOCUS_POCUS_PORT) || 80,
      debounce: 3000,
      timeout: 30000,
      maxDebounce: 10000,
    });

    hocuspocus.configure({
      extensions: [
        new Database({
          fetch: async ({ documentName }) => {
            return new Promise(async (resolve, reject) => {
              (async () => {
                try {
                  const postId = documentName.replace(
                    POST_HOCUSPOCUS_PREFIX,
                    '',
                  );

                  const postEntity = await postRepository.findOne({
                    select: ['id', 'content'],
                    where: {
                      id: +postId,
                    },
                  });

                  if (postEntity) {
                    resolve(postEntity.content);
                  }

                  // const document = await prisma.documents.findUnique({
                  //   where: {
                  //     id: documentId,
                  //   },
                  // });

                  // if (document) resolve(document.data);

                  reject('Document not existed');
                } catch (error) {
                  reject(error);
                }
              })();
            });
          },
          store: async ({ document, documentName, state }) => {
            try {
              document.broadcastStateless(EHocuspocusEvents.DOCUMENT_SAVING);

              const postId = documentName.replace(POST_HOCUSPOCUS_PREFIX, '');

              const postEntity = await postRepository.findOne({
                select: ['id', 'content'],
                where: {
                  id: +postId,
                },
              });

              if (!postEntity) {
                throw new Error('Post not found');
              }

              postEntity.content = state;
              await postRepository.save(postEntity);

              document.broadcastStateless(EHocuspocusEvents.DOCUMENT_SAVED);

              // await prisma.documents.update({
              //   where: {
              //     id: documentId,
              //   },
              //   data: {
              //     data: state,
              //   },
              // });
            } catch (error) {}
          },
        }),
      ],
      // async onChange(data) {
      //   console.log('onChange', data);
      // },
    });

    return hocuspocus;
  },
  inject: [PostRepository],
};

@Module({
  imports: [PostsModule],
  providers: [HocuspocusProvider],
  exports: [HocuspocusProvider],
})
export class HocuspocusModule {}
