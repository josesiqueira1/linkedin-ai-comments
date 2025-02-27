import { CommentConfig, ReplyConfig } from 'models/types';

export interface AIService {
    buildCommentPrompt(postContent: string, config: CommentConfig): string
    buildReplyPrompt(commentContent: string, config: ReplyConfig): string
    generateComment(postContent: string, config: CommentConfig): Promise<string>;
    generateReply(commentContent: string, config: ReplyConfig): Promise<string>;
    callAI(prompt: string): Promise<string>;
}