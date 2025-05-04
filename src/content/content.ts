import { AIService } from "../services/ai/ai-service";
import { LinkedInService } from "../services/linkedin/linkedin-service";
import {
    CommentConfig,
    LLMConfig,
    LLMProvider,
    ReplyConfig,
    defaultLLMConfig,
    defaultCommentConfig,
    defaultReplyConfig,
} from "../models/types";
import { defaultOpenAIConfig, defaultOpenRouterConfig } from "../models/config";
import { StorageService } from "../services/storage/storage-service";
import { OpenAIService } from "services/ai/openai-service";

const linkedinService = new LinkedInService();
let llmConfig: LLMConfig = { ...defaultLLMConfig };
let commentConfig: CommentConfig = { ...defaultCommentConfig };
let replyConfig: ReplyConfig = { ...defaultReplyConfig };

const getAiService = (provider: LLMProvider): AIService => {
    switch (provider) {
        case "OpenAI":
            return new OpenAIService(defaultOpenAIConfig);
        case "OpenRouter":
            return new OpenAIService(defaultOpenRouterConfig);
    }
};

// Carrega as configurações salvas quando a página carrega
async function loadSavedConfigs() {
    const savedLLMConfig = await StorageService.getLLMConfig();
    if (savedLLMConfig) {
        llmConfig = savedLLMConfig;
    }

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

document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    // Post na timeline
    if (
        target.closest(
            '.feed-shared-social-action-bar__action-button button[aria-label*="Comment"]',
        )
    ) {
        event.preventDefault();
        const aiService = getAiService(llmConfig.provider);
        const { text: postContent, parent: postParent } =
            getPostContent(target);
        if (!postParent) return;

        const commentBox = linkedinService.getCommentBox(postParent);
        if (!commentBox) return;
        linkedinService.insertLoadingSpinner(commentBox);

        const comment = await aiService.generateComment(
            postContent,
            commentConfig,
        );
        linkedinService.fillComment(comment, commentBox);
    }

    // Responder comentário
    if (
        target.closest(
            "button.comments-comment-social-bar__reply-action-button--cr",
        )
    ) {
        event.preventDefault();
        const aiService = getAiService(llmConfig.provider);
        const { text: commentContent, parent: commentParent } =
            getCommentContent(target);
        if (!commentParent) return;

        const replyBox = linkedinService.getReplyBox(commentParent);
        if (!replyBox) return;

        const reply = await aiService.generateReply(
            commentContent,
            replyConfig,
        );
        linkedinService.fillReply(reply, replyBox);
    }

    // Artigo
    if (target.closest('button.comment-button[aria-label*="Comment on"]')) {
        event.preventDefault();
        const aiService = getAiService(llmConfig.provider);
        const { text: postContent, parent: postParent } =
            getArticleContent(target);
        if (!postParent) return;

        const commentBox = linkedinService.getCommentBox(postParent);
        if (!commentBox) return;
        linkedinService.insertLoadingSpinner(commentBox);

        const comment = await aiService.generateComment(
            postContent,
            commentConfig,
        );
        linkedinService.fillComment(comment, commentBox);
    }
});

chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
        case "updateLLMConfig":
            llmConfig = message.config;
            break;
        case "updateCommentConfig":
            commentConfig = message.config;
            break;
        case "updateReplyConfig":
            replyConfig = message.config;
            break;
    }
});

function getPostContent(button: HTMLElement): ContentDetail {
    const getText = (element: HTMLElement) => element.textContent?.trim() || "";

    const container = button.closest(".feed-shared-update-v2");
    if (!container) return { text: "", parent: null };

    const post = container.querySelector(".fie-impression-container");
    const nestedPosts = post?.querySelectorAll(
        ".feed-shared-update-v2__description",
    );

    let text = "";
    if (!nestedPosts) return { text, parent: container as HTMLElement };

    const postArray = Array.from(nestedPosts);
    const authorPost = postArray.shift();
    text += `Author's post: ${getText(authorPost as HTMLElement)}\n`;

    for (const post of postArray) {
        text += `Reposted: ${getText(post as HTMLElement)}\n`;
    }

    return { text, parent: container as HTMLElement };
}

function getCommentContent(button: HTMLElement): ContentDetail {
    const parent = button.closest(
        "div.comment-social-activity:not(.comment-social-activity--is-reply)",
    );
    const commentContainer = button
        .closest("article")
        ?.querySelector(".comments-thread-entity");
    if (!commentContainer) return { text: "", parent: null };
    const contentElement = commentContainer.querySelector(
        ".comments-comment-item__main-content",
    );
    return {
        text: contentElement?.textContent?.trim() || "",
        parent: parent as HTMLElement,
    };
}

function getArticleContent(button: HTMLElement): ContentDetail {
    const getText = (element: HTMLElement) => element.textContent?.trim() || "";

    const container = button.closest("div.scaffold-layout__content");
    if (!container) return { text: "", parent: null };

    const title = container.querySelector("h1.reader-article-header__title");
    const post = container.querySelector("div.reader-content-blocks-container");

    const text = `Title: ${getText(title as HTMLElement)}
    Content: ${getText(post as HTMLElement)}`;

    return { text, parent: container as HTMLElement };
}
