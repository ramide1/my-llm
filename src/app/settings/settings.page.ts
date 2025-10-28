import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonInput, IonList, IonItem, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonInput, IonList, IonItem, IonButton, FormsModule]
})
export class SettingsPage implements OnInit {
  constructor(public configService: ConfigService, private alertService: AlertService) { }

  async ngOnInit(): Promise<void> {
    try {
      const savedConfig: boolean = await this.configService.getConfig();
      if (!savedConfig) throw new Error('Error loading config');
    } catch (error: any) {
      await this.alertService.presentAlert(error.message, 'Error');
    }
  }

  public async onSubmit(): Promise<void> {
    try {
      const savedConfig: boolean = await this.configService.updateConfig();
      if (!savedConfig) throw new Error('Error saving config');
      await this.alertService.presentAlert('Config Saved', 'Success');
    } catch (error: any) {
      await this.alertService.presentAlert(error.message, 'Error');
    }
  }
}