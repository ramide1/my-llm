import { Content } from "./content.interface";

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string | Content[];
  created: Date;
}