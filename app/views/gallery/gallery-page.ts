import { EventData, Page } from '@nativescript/core';
import { GalleryViewModel } from './gallery-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new GalleryViewModel();
}