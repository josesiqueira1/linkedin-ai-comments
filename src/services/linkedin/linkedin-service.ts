export class LinkedInService {
    private fillTextArea(text: string, target: HTMLElement) {
        if (!target) return;
        target.innerText = text;
        target.focus();
        target.dispatchEvent(new Event("input", { bubbles: true }));
    }

    private getLoadingSpinnerSVG(
        width: number,
        height: number,
        color: string,
    ): string {
        return `
                <svg width=${width} height=${height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-testid="ai-loading-spinner">
                    <style>
                        .spinner {
                            animation: rotate 2s linear infinite;
                            transform-origin: center;
                        }
                        .path {
                            stroke: ${color};
                            stroke-width: 3;
                            stroke-linecap: round;
                            animation: dash 1.5s ease-in-out infinite;
                        }
                        @keyframes rotate {
                            100% {
                                transform: rotate(360deg);
                            }
                        }
                        @keyframes dash {
                            0% {
                                stroke-dasharray: 1, 150;
                                stroke-dashoffset: 0;
                            }
                            50% {
                                stroke-dasharray: 90, 150;
                                stroke-dashoffset: -35;
                            }
                            100% {
                                stroke-dasharray: 90, 150;
                                stroke-dashoffset: -124;
                            }
                        }
                    </style>
                    <circle class="spinner path" cx="12" cy="12" r="10" fill="none"></circle>
                </svg>
                <span style="margin-left: 8px; color: #666;">Gerando resposta...</span>
            `;
    }

    private getLoadingSpinner(): HTMLElement {
        const loadingSpinner = document.createElement("div");
        loadingSpinner.className = "ai-comment-loading-spinner";
        loadingSpinner.style.cssText = `
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                padding: 10px 0;
            `;

        loadingSpinner.innerHTML = this.getLoadingSpinnerSVG(24, 24, "#0073b1");

        return loadingSpinner;
    }

    private getCommentBoxTextEditor(editor: HTMLElement): HTMLElement | null {
        return editor.closest(`.comments-comment-box-comment__text-editor`);
    }

    getCommentBox(parent: HTMLElement): HTMLElement | null {
        return parent.querySelector(".comments-comment-box--cr .ql-editor");
    }

    getReplyBox(parent: HTMLElement): HTMLElement | null {
        return parent.querySelector(".comments-comment-box__form .ql-editor");
    }

    fillComment(text: string, editor: HTMLElement): void {
        this.fillTextArea(text, editor as HTMLElement);
        this.removeLoadingSpinner(editor);
    }

    fillReply(text: string, editor: HTMLElement): void {
        this.fillTextArea(text, editor as HTMLElement);
        this.removeLoadingSpinner(editor);
    }

    insertLoadingSpinner(editor: HTMLElement): void {
        if (!editor) return;

        this.getCommentBoxTextEditor(editor)?.appendChild(
            this.getLoadingSpinner(),
        );
    }

    removeLoadingSpinner(editor: HTMLElement): void {
        const parent = this.getCommentBoxTextEditor(editor);
        parent?.querySelector(".ai-comment-loading-spinner")?.remove();
    }
}
