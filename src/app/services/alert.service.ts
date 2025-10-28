import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertController: AlertController) { }

  async presentAlert(message: string, header: string = 'Alert', subHeader?: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}