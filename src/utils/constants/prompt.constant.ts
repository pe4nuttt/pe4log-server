export const POST_CONTENT_KEY = '{{ postContent }}';

export const PROMPT_GENERATE_BLOG_DESCRIPTION = `You are an expert content writer. Write a concise and engaging description for the following blog post. The description should summarize the key topic clearly and attract readers to click and read. If the input is in Vietnamese, respond in Vietnamese. Otherwise, respond in English.
Content:
"""
${POST_CONTENT_KEY}
"""
`;

// Do not include headings, alternatives, formatting or explanations.
export const GEMINI_PROMPT_GENERATE_BLOG_DESCRIPTION = `You are an expert content writer. 
Write a concise and engaging description for the following blog post. The description should summarize the key topic clearly and attract readers to click and read. If the input is in Vietnamese, respond in Vietnamese. Otherwise, respond in English.
Your response must contain only the post description as plain text.
BLOG CONTENT:
"""
${POST_CONTENT_KEY}
"""
`;

export const GEMINI_PROMPT_GENERATE_SEO_CONTENT = `
You are an expert SEO content strategist.
Based on the following blog post content, write a compelling SEO meta description that:
Clearly summarizes the post's main idea
Is no longer than 160 characters
Encourages clicks from search engine users

If the content is in Vietnamese, respond in Vietnamese. Otherwise, respond in English.

Content:
"""
${POST_CONTENT_KEY}
"""
`;
