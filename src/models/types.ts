export type CommentLength =
    | "veryShort"
    | "short"
    | "medium"
    | "long"
    | "veryLong";

export type CommentTone =
    | "Excited"
    | "Happy"
    | "Gracious"
    | "Supportive"
    | "Polite"
    | "Witty"
    | "Comic"
    | "RespectfullyOpposed"
    | "Provocative"
    | "Controversial"
    | "Disappointed"
    | "Sad"
    | "Frustrated"
    | "Sarcastic"
    | "Angry"
    | "Nasty";

export type LLMProvider = "OpenAI" | "OpenRouter";

export interface CommentConfig {
    length: CommentLength;
    tone: CommentTone;
    openEnded: boolean;
}

export interface ReplyConfig {
    keepShort: boolean;
    openEnded: boolean;
}

export interface LLMConfig {
    provider: LLMProvider;
}

export interface LLMCredentials {
    url: string;
    apiKey: string;
    model: string;
}

export const defaultLLMConfig: LLMConfig = {
    provider: "OpenRouter",
};

export const defaultCommentConfig: CommentConfig = {
    length: "medium",
    tone: "Polite",
    openEnded: false,
};

export const defaultReplyConfig: ReplyConfig = {
    keepShort: true,
    openEnded: false,
};
