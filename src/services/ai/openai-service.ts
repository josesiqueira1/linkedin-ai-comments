import { AbstractAIService } from "./abstract-ai-service";
import { LLMCredentials } from "../../models/types";

export class OpenAIService extends AbstractAIService {
    private config: LLMCredentials;

    constructor(config: LLMCredentials) {
        super();
        this.config = config;
    }

    async callAI(prompt: string): Promise<string> {
        const response = await fetch(this.config.url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.config.apiKey}`,
                "Content-Type": "application/json",
                Origin: "https://linkedin.com",
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate response");
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "";
    }
}
