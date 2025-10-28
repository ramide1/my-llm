import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonInput, IonList, IonItem, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';
import { AlertService } from '../services/alert.service';
import { ConfigService } from '../services/config.service';
import { ChatsService } from '../services/chats.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonInput, IonList, IonItem, IonButton, FormsModule]
})
export class ChatsPage implements OnInit {
  @ViewChild('main') main!: ElementRef;
  public chat: Chat = {
    id: crypto.randomUUID(),
    title: 'New Chat',
    messages: [
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Hi! How can i help you today?',
        created: new Date()
      }
    ],
    created: new Date()
  };
  public currentMessage: string = '';
  public isSending: boolean = false;
  public isWriting: boolean = false;
  private chatId: string = '';
  private activatedRoute = inject(ActivatedRoute);
  constructor(private chatsService: ChatsService, private configService: ConfigService, private alertService: AlertService) {
    const chatId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;
    if ((chatId !== '') && (chatId !== null)) this.chatId = chatId;
  }

  async ngOnInit(): Promise<void> {
    await this.getChat();
    this.scrollToBottom();
  }

  private async getChat(): Promise<void> {
    try {
      if (this.chatId !== '') {
        const savedChat: Chat | null = this.chatsService.getChat(this.chatId);
        if (savedChat !== null) this.chat = savedChat;
      }
      const savedConfig: boolean = await this.configService.getConfig();
      if (!savedConfig) throw new Error('Error loading config');
    } catch (error: any) {
      await this.alertService.presentAlert(error.message, 'Error');
    }
  }

  private scrollToBottom(): void {
    const mainElement = this.main.nativeElement;
    mainElement.scrollTop = mainElement.scrollHeight;
  }

  public async onSubmit(): Promise<void> {
    try {
      this.isSending = true;
      this.isWriting = true;
      const currentMessage: string = this.currentMessage;
      this.currentMessage = '';
      if (this.chatId === '') {
        this.chat.title = currentMessage;
        const savedChat = await this.chatsService.addChat(this.chat);
        if (!savedChat) throw new Error('Error saving chat');
        this.chatId = this.chat.id;
      }
      const newMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: currentMessage,
        created: new Date()
      };
      const savedNewMessage = await this.chatsService.addMessage(this.chatId, newMessage);
      if (!savedNewMessage) throw new Error('Error saving user message');
      const response: any = await fetch(this.configService.config.api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.configService.config.selected_model,
          messages: this.chat.messages,
          stream: true
        })
      });
      if (!response.ok) throw new Error('Api response was not ok');
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        created: new Date()
      };
      const savedBotMessage = await this.chatsService.addMessage(this.chatId, botMessage);
      if (!savedBotMessage) throw new Error('Error saving bot message');
      this.isSending = false;
      let reply: string = '';
      for await (const value of (response.body as any).pipeThrough(new TextDecoderStream())) {
        const data: any = value.trim().split('data: ')[1];
        const [choice] = JSON.parse(data).choices;
        const content = choice?.delta?.content ?? '';
        reply += content;
        botMessage.content = reply;
        this.scrollToBottom();
      }
      const updatedChats = await this.chatsService.updateChats();
      if (!updatedChats) throw new Error('Error updating chats');
      this.isWriting = false;
    } catch (error: any) {
      this.isSending = false;
      this.isWriting = false;
      await this.alertService.presentAlert(error.message, 'Error');
    }
  }
}