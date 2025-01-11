import { Observable } from '@nativescript/core';
import { ImageService } from '../../services/image.service';
import { ImageData } from '../../database/storage.service';

export class GalleryViewModel extends Observable {
    private imageService: ImageService;
    private _collections: string[] = [];
    private _images: ImageData[] = [];
    private _showImages: boolean = false;

    constructor() {
        super();
        this.imageService = new ImageService();
        this.initialize();
    }

    async initialize(): Promise<void> {
        await this.imageService.initialize();
        await this.loadCollections();
    }

    async loadCollections(): Promise<void> {
        const collections = await this.imageService.getCollections();
        this.collections = collections;
    }

    async onCollectionTap(args: any): Promise<void> {
        const collection = this.collections[args.index];
        const images = await this.imageService.getImagesInCollection(collection);
        this.images = images;
        this.showImages = true;
    }

    get collections(): string[] {
        return this._collections;
    }

    set collections(value: string[]) {
        if (this._collections !== value) {
            this._collections = value;
            this.notifyPropertyChange('collections', value);
        }
    }

    get images(): ImageData[] {
        return this._images;
    }

    set images(value: ImageData[]) {
        if (this._images !== value) {
            this._images = value;
            this.notifyPropertyChange('images', value);
        }
    }

    get showImages(): boolean {
        return this._showImages;
    }

    set showImages(value: boolean) {
        if (this._showImages !== value) {
            this._showImages = value;
            this.notifyPropertyChange('showImages', value);
        }
    }
}