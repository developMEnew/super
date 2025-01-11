import { File, Folder, knownFolders, path } from '@nativescript/core';

export interface ImageData {
  id: string;
  name: string;
  price: number;
  collection: string;
  path: string;
}

export class StorageService {
  private readonly STORAGE_FILE = 'gallery-data.json';
  private data: ImageData[] = [];

  constructor() {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    const documents = knownFolders.documents();
    const filePath = path.join(documents.path, this.STORAGE_FILE);
    
    try {
      if (File.exists(filePath)) {
        const file = File.fromPath(filePath);
        const content = await file.readText();
        this.data = JSON.parse(content);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = [];
    }
  }

  private async saveData(): Promise<void> {
    const documents = knownFolders.documents();
    const filePath = path.join(documents.path, this.STORAGE_FILE);
    const file = File.fromPath(filePath);
    await file.writeText(JSON.stringify(this.data));
  }

  async saveImageData(data: Omit<ImageData, 'id'>): Promise<void> {
    const newImage = {
      ...data,
      id: Date.now().toString()
    };
    this.data.push(newImage);
    await this.saveData();
  }

  async getImagesByCollection(collection: string): Promise<ImageData[]> {
    return this.data.filter(img => img.collection === collection);
  }

  async getAllCollections(): Promise<string[]> {
    const collections = new Set(this.data.map(img => img.collection));
    return Array.from(collections);
  }
}