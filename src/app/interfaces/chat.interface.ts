import { Message } from "./message.interface";

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  created: Date;
}