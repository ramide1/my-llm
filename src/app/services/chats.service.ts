import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  public chats: Chat[] = [];
  public readonly CHATS_STORAGE_KEY: string = 'chats';

  constructor(private storageService: StorageService) { }

  public async getChats(): Promise<boolean> {
    try {
      await this.storageService.init();
      const savedChats: Chat[] | null = await this.storageService.get(this.CHATS_STORAGE_KEY);
      if ((savedChats !== null) && (savedChats.length !== 0)) {
        this.chats = savedChats;
        this.chats.sort((a, b) =>
          new Date(b.created).getTime() - new Date(a.created).getTime()
        );
      }
      return true;
    } catch (error: any) {
      return false;
    }
  }

  public async updateChats(): Promise<boolean> {
    try {
      await this.storageService.set(this.CHATS_STORAGE_KEY, this.chats);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  public async addChat(newChat: Chat): Promise<boolean> {
    try {
      const chatExists: Chat | undefined = this.chats.find((chat: Chat) => chat.id === newChat.id);
      if (chatExists) throw new Error('This chat already exists');
      this.chats.push(newChat);
      const updatedChats = await this.updateChats();
      if (!updatedChats) throw new Error('Error updating chats');
      return true;
    } catch (error: any) {
      return false;
    }
  }

  public getChat(chatId: string): Chat | null {
    try {
      const chatExists: Chat | undefined = this.chats.find((chat: Chat) => chat.id === chatId);
      if (!chatExists) throw new Error('This chat not exists');
      return chatExists;
    } catch (error: any) {
      return null;
    }
  }

  public async addMessage(chatId: string, message: Message): Promise<boolean> {
    try {
      const chatExists: Chat | undefined = this.chats.find((chat: Chat) => chat.id === chatId);
      if (!chatExists) throw new Error('This chat not exists');
      chatExists.messages.push(message);
      const updatedChats = await this.updateChats();
      if (!updatedChats) throw new Error('Error updating chats');
      return true;
    } catch (error: any) {
      return false;
    }
  }
}