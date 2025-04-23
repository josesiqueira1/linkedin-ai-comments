import {
    CommentConfig,
    LLMConfig,
    ReplyConfig,
    defaultCommentConfig,
    defaultLLMConfig,
    defaultReplyConfig,
} from "../models/types";
import { StorageService } from "../services/storage/storage-service";

let llmConfig: LLMConfig = { ...defaultLLMConfig };
let commentConfig: CommentConfig = { ...defaultCommentConfig };
let replyConfig: ReplyConfig = { ...defaultReplyConfig };

// Carrega as configurações salvas quando o popup abre
async function loadSavedConfigs() {
    const savedLLMConfig = await StorageService.getLLMConfig();
    if (savedLLMConfig) {
        llmConfig = savedLLMConfig;
        updateLLMConfigUI();
    }

    const savedCommentConfig = await StorageService.getCommentConfig();
    if (savedCommentConfig) {
        commentConfig = savedCommentConfig;
        updateCommentConfigUI();
    }

    const savedReplyConfig = await StorageService.getReplyConfig();
    if (savedReplyConfig) {
        replyConfig = savedReplyConfig;
        updateReplyConfigUI();
    }
}

function updateLLMConfigUI() {
    const llmSelect = document.getElementById("llmSelect") as HTMLSelectElement;

    if (llmSelect) llmSelect.value = llmConfig.provider;
}

// Atualiza a UI com as configurações carregadas
function updateCommentConfigUI() {
    const lengthSlider = document.getElementById(
        "lengthSlider",
    ) as HTMLInputElement;
    const lengthValue = document.getElementById(
        "lengthValue",
    ) as HTMLSpanElement;
    const toneSelect = document.getElementById(
        "toneSelect",
    ) as HTMLSelectElement;
    const openEndedCheckbox = document.getElementById(
        "openEndedComment",
    ) as HTMLInputElement;

    if (lengthSlider) {
        const lengthValues = [
            "veryShort",
            "short",
            "medium",
            "long",
            "veryLong",
        ];
        const lengthLabels = [
            "Very Short",
            "Short",
            "Medium",
            "Long",
            "Very Long",
        ];
        const index = lengthValues.indexOf(commentConfig.length);
        lengthSlider.value = index.toString();
        if (lengthValue) lengthValue.textContent = lengthLabels[index];
    }

    if (toneSelect) toneSelect.value = commentConfig.tone;
    if (openEndedCheckbox) openEndedCheckbox.checked = commentConfig.openEnded;
}

function updateReplyConfigUI() {
    const keepShortCheckbox = document.getElementById(
        "keepShort",
    ) as HTMLInputElement;
    const openEndedCheckbox = document.getElementById(
        "openEndedReply",
    ) as HTMLInputElement;

    if (keepShortCheckbox) keepShortCheckbox.checked = replyConfig.keepShort;
    if (openEndedCheckbox) openEndedCheckbox.checked = replyConfig.openEnded;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    loadSavedConfigs();

    document
        .getElementById("llmSelect")
        ?.addEventListener("change", async (e) => {
            const select = e.target as HTMLSelectElement;
            llmConfig.provider = select.value as LLMConfig["provider"];
            await StorageService.saveLLMConfig(llmConfig);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "updateLLMConfig",
                        config: llmConfig,
                    });
                }
            });
        });

    // Comment config listeners
    const lengthSlider = document.getElementById("lengthSlider");
    const lengthValue = document.getElementById("lengthValue");

    lengthSlider?.addEventListener("input", (e) => {
        const slider = e.target as HTMLInputElement;
        const lengthLabels = [
            "Very Short",
            "Short",
            "Medium",
            "Long",
            "Very Long",
        ];
        if (lengthValue)
            lengthValue.textContent = lengthLabels[parseInt(slider.value)];
    });

    lengthSlider?.addEventListener("change", async (e) => {
        const slider = e.target as HTMLInputElement;
        const lengths = ["veryShort", "short", "medium", "long", "veryLong"];
        commentConfig.length = lengths[
            parseInt(slider.value)
        ] as CommentConfig["length"];
        await StorageService.saveCommentConfig(commentConfig);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "updateCommentConfig",
                    config: commentConfig,
                });
            }
        });
    });

    document
        .getElementById("toneSelect")
        ?.addEventListener("change", async (e) => {
            const select = e.target as HTMLSelectElement;
            commentConfig.tone = select.value as CommentConfig["tone"];
            await StorageService.saveCommentConfig(commentConfig);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "updateCommentConfig",
                        config: commentConfig,
                    });
                }
            });
        });

    document
        .getElementById("openEndedComment")
        ?.addEventListener("change", async (e) => {
            const checkbox = e.target as HTMLInputElement;
            commentConfig.openEnded = checkbox.checked;
            await StorageService.saveCommentConfig(commentConfig);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "updateCommentConfig",
                        config: commentConfig,
                    });
                }
            });
        });

    // Reply config listeners
    document
        .getElementById("keepShort")
        ?.addEventListener("change", async (e) => {
            const checkbox = e.target as HTMLInputElement;
            replyConfig.keepShort = checkbox.checked;
            await StorageService.saveReplyConfig(replyConfig);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "updateReplyConfig",
                        config: replyConfig,
                    });
                }
            });
        });

    document
        .getElementById("openEndedReply")
        ?.addEventListener("change", async (e) => {
            const checkbox = e.target as HTMLInputElement;
            replyConfig.openEnded = checkbox.checked;
            await StorageService.saveReplyConfig(replyConfig);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "updateReplyConfig",
                        config: replyConfig,
                    });
                }
            });
        });
});
