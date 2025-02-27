import { AIService } from '../services/ai/ai-service';
import { OpenRouterService } from '../services/ai/openrouter-service';
import { LinkedInService } from '../services/linkedin/linkedin-service';
import { CommentConfig, ReplyConfig, defaultCommentConfig, defaultReplyConfig } from '../models/types';
import { defaultOpenRouterConfig } from '../models/config';
import { StorageService } from '../services/storage/storage-service';

const aiService: AIService = new OpenRouterService(defaultOpenRouterConfig);
const linkedinService = new LinkedInService();
let commentConfig: CommentConfig = { ...defaultCommentConfig };
let replyConfig: ReplyConfig = { ...defaultReplyConfig };

// Carrega as configurações salvas quando a página carrega
async function loadSavedConfigs() {
    const savedCommentConfig = await StorageService.getCommentConfig();
    if (savedCommentConfig) {
        commentConfig = savedCommentConfig;
    }

    const savedReplyConfig = await StorageService.getReplyConfig();
    if (savedReplyConfig) {
        replyConfig = savedReplyConfig;
    }
}

// Carrega as configurações assim que o script é iniciado
loadSavedConfigs();

export interface ContentDetail {
    text: string;
    parent: HTMLElement | null;
}

document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;

    if (target.closest('.feed-shared-social-action-bar__action-button button[aria-label*="Comment"]')) {
        event.preventDefault();
        const { text: postContent, parent: postParent } = getPostContent(target);
        if (!postParent) return;
        const comment = await aiService.generateComment(postContent, commentConfig);
        linkedinService.fillComment(comment, postParent as HTMLElement);
    }

    if (target.closest('button.comments-comment-social-bar__reply-action-button--cr')) {
        event.preventDefault();
        const { text: commentContent, parent: commentParent } = getCommentContent(target);
        if (!commentParent) return;
        const reply = await aiService.generateReply(commentContent, replyConfig);
        linkedinService.fillReply(reply, commentParent as HTMLElement);
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'updateCommentConfig') {
        commentConfig = message.config;
    } else if (message.type === 'updateReplyConfig') {
        replyConfig = message.config;
    }
});

function getPostContent(button: HTMLElement): ContentDetail {
    const container = button.closest('.feed-shared-update-v2');
    if (!container) return { text: '', parent: null };
    const contentElement = container.querySelector('.feed-shared-update-v2__description');
    return { text: contentElement?.textContent?.trim() || '', parent: container as HTMLElement };
}

function getCommentContent(button: HTMLElement): ContentDetail {
    const parent = button.closest('div.comment-social-activity:not(.comment-social-activity--is-reply)');
    const commentContainer = parent?.closest('.comments-comment-entity');
    if (!commentContainer) return { text: '', parent: null };
    const contentElement = commentContainer.querySelector('.comments-comment-item__main-content');
    return { text: contentElement?.textContent?.trim() || '', parent: parent as HTMLElement };
}