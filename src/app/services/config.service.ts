import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ChatConfig } from '../interfaces/chatConfig.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public config: ChatConfig = {
    api_url: 'http://localhost:11434/v1/chat/completions',
    selected_model: 'gemma3'
  };
  public readonly CONFIG_STORAGE_KEY: string = 'config';

  constructor(private storageService: StorageService) { }

  public async getConfig(): Promise<boolean> {
    try {
      await this.storageService.init();
      const savedConfig: ChatConfig | null = await this.storageService.get(this.CONFIG_STORAGE_KEY);
      if (savedConfig !== null) this.config = savedConfig;
      return true;
    } catch (error: any) {
      return false;
    }
  }

  public async updateConfig(): Promise<boolean> {
    try {
      await this.storageService.set(this.CONFIG_STORAGE_KEY, this.config);
      return true;
    } catch (error: any) {
      return false;
    }
  }
}