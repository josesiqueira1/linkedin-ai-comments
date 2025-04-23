export class LinkedInService {
    fillComment(text: string, commentBox: HTMLElement): void {
        const t = commentBox.querySelector(
            ".comments-comment-box--cr .ql-editor",
        );
        this.fillTextArea(text, t as HTMLElement);
    }

    fillReply(text: string, replyButton: HTMLElement): void {
        const t = replyButton.querySelector(
            ".comments-comment-box__form .ql-editor",
        );
        this.fillTextArea(text, t as HTMLElement);
    }

    private fillTextArea(text: string, target: HTMLElement) {
        if (!target) return;
        target.innerText = text;
        target.focus();
        target.dispatchEvent(new Event("input", { bubbles: true }));
    }
}
