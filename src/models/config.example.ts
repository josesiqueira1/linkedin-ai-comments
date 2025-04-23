//@ts-ignore
import { LLMCredentials } from "./types";

export const defaultOpenRouterConfig: LLMCredentials = {
    url: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: "YOUR-API-KEY-HERE",
    model: "mistralai/mistral-7b-instruct",
};

export const defaultOpenAIConfig: LLMCredentials = {
    url: "https://api.openai.com/v1/chat/completions",
    apiKey: "YOUR-API-KEY-HERE",
    model: "o4-mini",
};
