/**
 * Campaign Model
 * 
 * Represents a political campaign with area information.
 */

import { BaseModel } from './BaseModel';
import path from 'path';

export class CampaignModel extends BaseModel {
  politicianId: string;
  year: number;
  areaName: string;

  constructor(
    id?: string,
    politicianId: string = '',
    year: number = new Date().getFullYear(),
    areaName: string = ''
  ) {
    super(id);
    this.politicianId = politicianId;
    this.year = year;
    this.areaName = areaName;
  }

  /**
   * Convert instance to CSV row format
   */
  toCSVRow(): string[] {
    return [
      this.id,
      this.politicianId,
      String(this.year),
      this.areaName,
    ];
  }

  /**
   * Create instance from CSV row
   */
  static fromCSVRow(row: string[]): CampaignModel {
    return new CampaignModel(
      row[0], // id
      row[1], // politician_id
      parseInt(row[2], 10), // year
      row[3]  // area_name
    );
  }

  /**
   * Get CSV file path
   */
  protected static getFilePath(): string {
    return path.join(process.cwd(), 'data', 'campaigns.csv');
  }

  /**
   * Get CSV headers
   */
  protected static getHeaders(): string[] {
    return ['id', 'politician_id', 'year', 'area_name'];
  }

  /**
   * Create a new CampaignModel instance
   */
  static async create(data: {
    politicianId: string;
    year: number;
    areaName: string;
  }): Promise<CampaignModel> {
    const instance = new CampaignModel(
      undefined,
      data.politicianId,
      data.year,
      data.areaName
    );
    return await instance.save() as CampaignModel;
  }

  /**
   * Get the latest campaign for a politician
   */
  static async getLatestByPoliticianId(politicianId: string): Promise<CampaignModel | null> {
    const allCampaigns = await this.findAll() as CampaignModel[];
    const politicianCampaigns = allCampaigns.filter(c => c.politicianId === politicianId);
    
    if (politicianCampaigns.length === 0) {
      return null;
    }

    // Sort by year descending and return the latest
    return politicianCampaigns.sort((a, b) => b.year - a.year)[0];
  }
}
