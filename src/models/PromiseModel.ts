/**
 * Promise Model
 * 
 * Represents a political promise with details and status.
 */

import { BaseModel } from './BaseModel';
import { PoliticianModel } from './PoliticianModel';
import path from 'path';

export type PromiseStatus = 'เงียบหาย' | 'ยังไม่เริ่ม' | 'กำลังดำเนินการ' | 'สำเร็จ' | 'ล้มเหลว';

export interface PromiseWithPolitician {
  id: string;
  politicianId: string;
  politicianName: string;
  partyName: string;
  name: string;
  details: string;
  promiseDate: string;
  status: PromiseStatus;
  createdAt: string;
  updatedAt: string;
}

export class PromiseModel extends BaseModel {
  politicianId: string;
  name: string;
  details: string;
  promiseDate: string;
  status: PromiseStatus;
  createdAt: string;
  updatedAt: string;

  constructor(
    id?: string,
    politicianId: string = '',
    name: string = '',
    details: string = '',
    promiseDate: string = '',
    status: PromiseStatus = 'ยังไม่เริ่ม',
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id);
    this.politicianId = politicianId;
    this.name = name;
    this.details = details;
    this.promiseDate = promiseDate;
    this.status = status;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Convert instance to CSV row format
   */
  toCSVRow(): string[] {
    return [
      this.id,
      this.politicianId,
      this.name,
      this.details,
      this.promiseDate,
      this.status,
      this.createdAt,
      this.updatedAt,
    ];
  }

  /**
   * Create instance from CSV row
   */
  static fromCSVRow(row: string[]): PromiseModel {
    return new PromiseModel(
      row[0], // id
      row[1], // politician_id
      row[2], // name
      row[3], // details
      row[4], // promise_date
      row[5] as PromiseStatus, // status
      row[6], // createdAt
      row[7]  // updatedAt
    );
  }

  /**
   * Get CSV file path
   */
  protected static getFilePath(): string {
    return path.join(process.cwd(), 'data', 'promises.csv');
  }

  /**
   * Get CSV headers
   */
  protected static getHeaders(): string[] {
    return ['id', 'politician_id', 'name', 'details', 'promise_date', 'status', 'createdAt', 'updatedAt'];
  }

  /**
   * Get all promises with politician information
   */
  static async findAllWithPoliticians(): Promise<PromiseWithPolitician[]> {
    const promises = await this.findAll() as PromiseModel[];
    const politicians = await PoliticianModel.findAll() as PoliticianModel[];
    
    // Create a map for quick politician lookup
    const politicianMap = new Map(
      politicians.map(p => [p.id, p])
    );

    return promises.map(promise => {
      const politician = politicianMap.get(promise.politicianId);
      return {
        id: promise.id,
        politicianId: promise.politicianId,
        politicianName: politician?.name || 'Unknown',
        partyName: politician?.partyName || 'Unknown',
        name: promise.name,
        details: promise.details,
        promiseDate: promise.promiseDate,
        status: promise.status,
        createdAt: promise.createdAt,
        updatedAt: promise.updatedAt,
      };
    });
  }

  /**
   * Get a promise by ID with politician information
   */
  static async findByIdWithPolitician(id: string): Promise<PromiseWithPolitician | null> {
    const promise = await this.findById(id) as PromiseModel | null;
    if (!promise) return null;

    const politician = await PoliticianModel.findById(promise.politicianId) as PoliticianModel | null;

    return {
      id: promise.id,
      politicianId: promise.politicianId,
      politicianName: politician?.name || 'Unknown',
      partyName: politician?.partyName || 'Unknown',
      name: promise.name,
      details: promise.details,
      promiseDate: promise.promiseDate,
      status: promise.status,
      createdAt: promise.createdAt,
      updatedAt: promise.updatedAt,
    };
  }

  /**
   * Create a new PromiseModel instance
   */
  static async create(data: {
    politicianId: string;
    name: string;
    details: string;
    promiseDate: string;
    status?: PromiseStatus;
  }): Promise<PromiseModel> {
    const instance = new PromiseModel(
      undefined,
      data.politicianId,
      data.name,
      data.details,
      data.promiseDate,
      data.status || 'ยังไม่เริ่ม'
    );
    return await instance.save() as PromiseModel;
  }
}
