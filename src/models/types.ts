export type CommentLength = 'veryShort' | 'short' | 'medium' | 'long' | 'veryLong';

export type CommentTone =
    | 'Excited'
    | 'Happy'
    | 'Gracious'
    | 'Supportive'
    | 'Polite'
    | 'Witty'
    | 'Comic'
    | 'RespectfullyOpposed'
    | 'Provocative'
    | 'Controversial'
    | 'Disappointed'
    | 'Sad'
    | 'Frustrated'
    | 'Sarcastic'
    | 'Angry'
    | 'Nasty';

export interface CommentConfig {
    length: CommentLength;
    tone: CommentTone;
    openEnded: boolean;
}

export interface ReplyConfig {
    keepShort: boolean;
    openEnded: boolean;
}

export interface OpenRouterConfig {
    apiKey: string;
    model: string;
}

export const defaultCommentConfig: CommentConfig = {
    length: 'medium',
    tone: 'Polite',
    openEnded: false
};

export const defaultReplyConfig: ReplyConfig = {
    keepShort: true,
    openEnded: false
};
