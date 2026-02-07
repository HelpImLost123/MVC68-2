/**
 * Base Model Class
 * 
 * This abstract class provides the foundation for all data models in the MVC architecture.
 * It includes CRUD operations that interact with CSV files as a mock database.
 * 
 * Each model extending this class must:
 * - Define its own properties
 * - Specify the CSV file path
 * - Implement the toCSVRow and fromCSVRow methods for serialization
 */

import { readCSV, writeCSV } from '../utils/csvHelper';

export interface ModelInterface {
  id: string;
  toCSVRow(): string[];
}

export abstract class BaseModel implements ModelInterface {
  id: string;

  constructor(id?: string) {
    this.id = id || '';
  }

  /**
   * Generate a unique ID for new records using auto-increment
   */
  protected async generateId(): Promise<string> {
    const ModelClass = this.constructor as typeof BaseModel;
    const records = await ModelClass.findAll();
    
    // Find the highest numeric ID
    let maxId = 0;
    for (const record of records) {
      const numId = parseInt(record.id, 10);
      if (!isNaN(numId) && numId > maxId) {
        maxId = numId;
      }
    }
    
    return String(maxId + 1);
  }

  /**
   * Convert model instance to CSV row format
   * Must be implemented by each specific model
   */
  abstract toCSVRow(): string[];

  /**
   * Create model instance from CSV row data
   * Must be implemented by each specific model
   */
  static fromCSVRow(row: string[]): BaseModel {
    throw new Error('fromCSVRow must be implemented in derived class');
  }

  /**
   * Get the CSV file path for this model
   * Must be implemented by each specific model
   */
  protected static getFilePath(): string {
    throw new Error('getFilePath must be implemented in derived class');
  }

  /**
   * Get the CSV headers for this model
   * Must be implemented by each specific model
   */
  protected static getHeaders(): string[] {
    throw new Error('getHeaders must be implemented in derived class');
  }

  /**
   * Find all records
   */
  static async findAll(): Promise<BaseModel[]> {
    try {
      const rows = await readCSV(this.getFilePath());
      return rows.map(row => this.fromCSVRow(row));
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  /**
   * Find record by ID
   */
  static async findById(id: string): Promise<BaseModel | null> {
    const records = await this.findAll();
    return records.find(record => record.id === id) || null;
  }

  /**
   * Save (create or update) a record
   */
  async save(): Promise<this> {
    const ModelClass = this.constructor as typeof BaseModel;
    const records = await ModelClass.findAll();
    
    // Generate ID if not set
    if (!this.id) {
      this.id = await this.generateId();
    }
    
    const existingIndex = records.findIndex(record => record.id === this.id);

    if (existingIndex >= 0) {
      // Update existing record
      records[existingIndex] = this;
    } else {
      // Add new record
      records.push(this);
    }

    // Convert all records to CSV rows
    const rows = records.map(record => record.toCSVRow());
    await writeCSV(ModelClass.getFilePath(), ModelClass.getHeaders(), rows);

    return this;
  }

  /**
   * Delete a record by ID
   */
  static async delete(id: string): Promise<boolean> {
    const records = await this.findAll();
    const filteredRecords = records.filter(record => record.id !== id);

    if (records.length === filteredRecords.length) {
      return false; // Record not found
    }

    const rows = filteredRecords.map(record => record.toCSVRow());
    await writeCSV(this.getFilePath(), this.getHeaders(), rows);

    return true;
  }

  /**
   * Sort records by a specific field
   */
  static sortBy<T extends BaseModel>(
    records: T[],
    field: keyof T,
    order: 'asc' | 'desc' = 'asc'
  ): T[] {
    return [...records].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
