export interface AiProvider {
  generateSeoContent(postText: string): Promise<string>;

  generateBlogDescription(postText: string): Promise<string>;
}
