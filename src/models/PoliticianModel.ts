/**
 * Politician Model
 * 
 * Represents a politician with their basic information.
 */

import { BaseModel } from './BaseModel';
import path from 'path';

export class PoliticianModel extends BaseModel {
  name: string;
  partyName: string;
  portraitUrl: string;

  constructor(
    id?: string,
    name: string = '',
    partyName: string = '',
    portraitUrl: string = ''
  ) {
    super(id);
    this.name = name;
    this.partyName = partyName;
    this.portraitUrl = portraitUrl;
  }

  /**
   * Override ID generation for politicians
   * Generates 8-digit ID with first digit not being zero
   */
  protected async generateId(): Promise<string> {
    const records = await PoliticianModel.findAll();
    
    // Find the highest 8-digit ID
    let maxId = 10000000; // Start from 10000000 (8 digits, first is 1)
    for (const record of records) {
      const numId = parseInt(record.id, 10);
      if (!isNaN(numId) && numId >= 10000000 && numId <= 99999999 && numId >= maxId) {
        maxId = numId;
      }
    }
    
    return String(maxId + 1);
  }

  /**
   * Convert instance to CSV row format
   */
  toCSVRow(): string[] {
    return [
      this.id,
      this.name,
      this.partyName,
      this.portraitUrl,
    ];
  }

  /**
   * Create instance from CSV row
   */
  static fromCSVRow(row: string[]): PoliticianModel {
    return new PoliticianModel(
      row[0], // id
      row[1], // name
      row[2], // party_name
      row[3]  // portrait_url
    );
  }

  /**
   * Get CSV file path
   */
  protected static getFilePath(): string {
    return path.join(process.cwd(), 'data', 'politicians.csv');
  }

  /**
   * Get CSV headers
   */
  protected static getHeaders(): string[] {
    return ['id', 'name', 'party_name', 'portrait_url'];
  }

  /**
   * Create a new PoliticianModel instance
   */
  static async create(data: {
    name: string;
    partyName: string;
    portraitUrl?: string;
  }): Promise<PoliticianModel> {
    const instance = new PoliticianModel(
      undefined,
      data.name,
      data.partyName,
      data.portraitUrl || ''
    );
    return await instance.save() as PoliticianModel;
  }
}
