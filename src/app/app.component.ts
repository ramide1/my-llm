import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubbleOutline, chatbubbleSharp, bookmarkOutline, bookmarkSharp, settingsOutline, settingsSharp } from 'ionicons/icons';
import { AlertService } from './services/alert.service';
import { ChatsService } from './services/chats.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  public appPages: any[] = [
    { title: 'New Chat', url: '/chats', icon: 'chatbubble' },
    { title: 'Settings', url: '/settings', icon: 'settings' }
  ];

  constructor(public chatsService: ChatsService, private alertService: AlertService) {
    addIcons({ chatbubbleOutline, chatbubbleSharp, bookmarkOutline, bookmarkSharp, settingsOutline, settingsSharp });
  }

  async ngOnInit(): Promise<void> {
    try {
      const savedChats: boolean = await this.chatsService.getChats();
      if (!savedChats) throw new Error('Error loading chats');
    } catch (error: any) {
      await this.alertService.presentAlert(error.message, 'Error');
    }
  }
}