import { User } from "./user";

export interface Message {
    author: User,
    content: string,
    created_at: string
}