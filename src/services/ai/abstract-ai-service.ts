import { AIService } from './ai-service';
import { CommentConfig, ReplyConfig, CommentTone } from 'models/types';

export abstract class AbstractAIService implements AIService {
    private getToneInstructions(tone: CommentTone): string {
        const toneGuides: Record<CommentTone, string> = {
            'Excited': 'Show high enthusiasm and excitement, use exclamation marks!',
            'Happy': 'Express joy and positivity in a cheerful way',
            'Gracious': 'Show gratitude and appreciation warmly',
            'Supportive': 'Offer encouragement and show strong support',
            'Polite': 'Be courteous and professional',
            'Witty': 'Use clever wordplay or subtle humor',
            'Comic': 'Be funny and lighthearted',
            'RespectfullyOpposed': 'Disagree politely while showing respect for the other view',
            'Provocative': 'Challenge assumptions and provoke thought, but stay professional',
            'Controversial': 'Take a strong opposing stance while remaining civil',
            'Disappointed': 'Express disappointment professionally',
            'Sad': 'Show sadness or concern appropriately',
            'Frustrated': 'Express frustration while staying professional',
            'Sarcastic': 'Use irony or sarcasm subtly',
            'Angry': 'Show strong disagreement or anger while remaining civil',
            'Nasty': 'Be harshly critical while avoiding personal attacks'
        };
        return toneGuides[tone];
    }

    buildCommentPrompt(postContent: string, config: CommentConfig): string {
        const lengthMap = {
            veryShort: '1 sentence, maximum 10 words',
            short: '1 sentence, maximum 20 words',
            medium: '2-3 sentences, maximum 40 words',
            long: '3-4 sentences, maximum 60 words',
            veryLong: '4-5 sentences, maximum 80 words'
        };

        const toneInstruction = this.getToneInstructions(config.tone);

        return `You are a professional LinkedIn user crafting a ${lengthMap[config.length]} comment on a post.
            Tone instruction: ${toneInstruction}
            ${config.openEnded ? 'End with an engaging question to encourage discussion.' : ''}
            IMPORTANT: Strictly follow the length limit. Do not exceed the maximum words specified.
            Post content: "${postContent}"
            Generate a comment that adds value to the discussion.
            IMPORTANT: Do not include word counts, quotes or any metadata in your response.
            Comment:`;
    }

    buildReplyPrompt(commentContent: string, config: ReplyConfig): string {
        const lengthGuide = config.keepShort ? 'Keep it very concise, maximum 10 words in 1 sentence.' : 'Write 2-3 sentences, maximum 20 words.';

        return `You are a professional LinkedIn user responding to a comment.
            ${lengthGuide}
            ${config.openEnded ? 'End with a question to encourage further discussion.' : ''}
            IMPORTANT: Strictly follow the length limit. Do not exceed the maximum words specified.
            Comment you are replying to: "${commentContent}"
            Write a thoughtful reply that adds value to the conversation while maintaining professionalism.
            IMPORTANT: Do not include word counts, quotes or any metadata in your response.
            Reply:`;
    }

    async generateComment(postContent: string, config: CommentConfig): Promise<string> {
        const prompt = this.buildCommentPrompt(postContent, config);
        const response = await this.callAI(prompt);
        return this.cleanResponse(response);
    }

    async generateReply(commentContent: string, config: ReplyConfig): Promise<string> {
        const prompt = this.buildReplyPrompt(commentContent, config);
        const response = await this.callAI(prompt);
        return this.cleanResponse(response);
    }

    protected cleanResponse(response: string): string {
        return response
            .replace(/^["']|["']$/g, '') // Remove aspas do início e fim
            .replace(/^(Comment:|Reply:)\s*/i, '') // Remove prefixos
            .trim();
    }

    abstract callAI(prompt: string): Promise<string>;
}
