import { CommentConfig, ReplyConfig } from "../../models/types";

export class StorageService {
    static async saveCommentConfig(config: CommentConfig): Promise<void> {
        await chrome.storage.local.set({ commentConfig: config });
    }

    static async getCommentConfig(): Promise<CommentConfig | null> {
        const result = await chrome.storage.local.get('commentConfig');
        return result.commentConfig || null;
    }

    static async saveReplyConfig(config: ReplyConfig): Promise<void> {
        await chrome.storage.local.set({ replyConfig: config });
    }

    static async getReplyConfig(): Promise<ReplyConfig | null> {
        const result = await chrome.storage.local.get('replyConfig');
        return result.replyConfig || null;
    }
} 