import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    return this._storage?.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public remove(key: string) {
    return this._storage?.remove(key);
  }

  public clear() {
    return this._storage?.clear();
  }

  public keys() {
    return this._storage?.keys();
  }

  public length() {
    return this._storage?.length();
  }

  public getAll() {
    let response: any[] = [];
    this._storage?.forEach((key, value, index) => {
      response[key] = { value, index };
    });
    return response;
  }
}