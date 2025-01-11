import { File, Folder, knownFolders, path } from '@nativescript/core';
import { StorageService, ImageData } from '../database/storage.service';

export class ImageService {
  private storageService: StorageService;
  private readonly IMAGES_FOLDER = 'path-my-shop';

  constructor() {
    this.storageService = new StorageService();
  }

  async initialize(): Promise<void> {
    await this.scanImagesFolder();
  }

  private async scanImagesFolder(): Promise<void> {
    const documents = knownFolders.documents();
    const galleryFolder = documents.getFolder(this.IMAGES_FOLDER);
    
    try {
      const entities = await galleryFolder.getEntities();
      
      for (const entity of entities) {
        if (entity instanceof File && this.isImageFile(entity.name)) {
          const metadataFile = this.getMetadataFile(entity.path);
          if (await File.exists(metadataFile)) {
            const metadata = await this.readMetadata(metadataFile);
            await this.storageService.saveImageData({
              name: metadata.name,
              price: metadata.price,
              collection: metadata.collection,
              path: entity.path
            });
          }
        }
      }
    } catch (error) {
      console.error('Error scanning images folder:', error);
    }
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  private getMetadataFile(imagePath: string): string {
    return imagePath.replace(/\.[^/.]+$/, '.json');
  }

  private async readMetadata(metadataPath: string): Promise<any> {
    const file = File.fromPath(metadataPath);
    const content = await file.readText();
    return JSON.parse(content);
  }

  async getCollections(): Promise<string[]> {
    return this.storageService.getAllCollections();
  }

  async getImagesInCollection(collection: string): Promise<ImageData[]> {
    return this.storageService.getImagesByCollection(collection);
  }
}