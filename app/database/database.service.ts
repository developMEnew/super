import { Sqlite } from '@nativescript/sqlite';

export interface ImageData {
  id: number;
  name: string;
  price: number;
  collection: string;
  path: string;
}

export class DatabaseService {
  private database: Sqlite;

  async init(): Promise<void> {
    this.database = await new Sqlite('gallery.db');
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    await this.database.execute(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        collection TEXT NOT NULL,
        path TEXT NOT NULL
      )
    `);
  }

  async saveImageData(data: Omit<ImageData, 'id'>): Promise<void> {
    await this.database.execute(
      'INSERT INTO images (name, price, collection, path) VALUES (?, ?, ?, ?)',
      [data.name, data.price, data.collection, data.path]
    );
  }

  async getImagesByCollection(collection: string): Promise<ImageData[]> {
    const result = await this.database.all(
      'SELECT * FROM images WHERE collection = ?',
      [collection]
    );
    return result;
  }

  async getAllCollections(): Promise<string[]> {
    const result = await this.database.all(
      'SELECT DISTINCT collection FROM images'
    );
    return result.map(row => row.collection);
  }
}