import { Message } from "~/@core/domain";

export interface MessageProps {
    message: Message;
}

export class MessageDTO {
    public readonly message: Message;

    constructor({ message }: MessageProps) {
        this.message = message;
    }

    toObject(): object {
        return {
            message: this.message
        }
    }
}