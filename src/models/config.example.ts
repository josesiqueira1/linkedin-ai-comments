//@ts-ignore
import { LLMCredentials } from "./types";

export const defaultOpenRouterConfig: LLMCredentials = {
    url: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: "YOUR-API-KEY-HERE",
    model: "deepseek/deepseek-r1:free",
};

export const defaultOpenAIConfig: LLMCredentials = {
    url: "https://api.openai.com/v1/chat/completions",
    apiKey: "YOUR-API-KEY-HERE",
    model: "gpt-4o-mini",
};
