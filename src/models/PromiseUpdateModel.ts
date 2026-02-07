/**
 * PromiseUpdate Model
 * 
 * Represents an update/history entry for a promise.
 */

import { BaseModel } from './BaseModel';
import path from 'path';
import { PromiseStatus } from './PromiseModel';

export class PromiseUpdateModel extends BaseModel {
  promiseId: string;
  updateDate: string;
  details: string;
  newStatus: PromiseStatus;

  constructor(
    id?: string,
    promiseId: string = '',
    updateDate: string = '',
    details: string = '',
    newStatus: PromiseStatus = 'ยังไม่เริ่ม'
  ) {
    super(id);
    this.promiseId = promiseId;
    this.updateDate = updateDate || new Date().toISOString();
    this.details = details;
    this.newStatus = newStatus;
  }

  /**
   * Convert instance to CSV row format
   */
  toCSVRow(): string[] {
    return [
      this.id,
      this.promiseId,
      this.updateDate,
      this.details,
      this.newStatus,
    ];
  }

  /**
   * Create instance from CSV row
   */
  static fromCSVRow(row: string[]): PromiseUpdateModel {
    // Handle both old format (without id) and new format (with id)
    if (row.length === 4) {
      // Old format: promise_id, update_date, details, new_status
      return new PromiseUpdateModel(
        undefined, // id will be generated
        row[0], // promise_id
        row[1], // update_date
        row[2], // details
        row[3] as PromiseStatus // new_status
      );
    } else {
      // New format: id, promise_id, update_date, details, new_status
      return new PromiseUpdateModel(
        row[0], // id
        row[1], // promise_id
        row[2], // update_date
        row[3], // details
        row[4] as PromiseStatus // new_status
      );
    }
  }

  /**
   * Get CSV file path
   */
  protected static getFilePath(): string {
    return path.join(process.cwd(), 'data', 'promise_updates.csv');
  }

  /**
   * Get CSV headers
   */
  protected static getHeaders(): string[] {
    return ['id', 'promise_id', 'update_date', 'details', 'new_status'];
  }

  /**
   * Create a new PromiseUpdateModel instance
   */
  static async create(data: {
    promiseId: string;
    details: string;
    newStatus: PromiseStatus;
  }): Promise<PromiseUpdateModel> {
    const instance = new PromiseUpdateModel(
      undefined,
      data.promiseId,
      new Date().toISOString(),
      data.details,
      data.newStatus
    );
    return await instance.save() as PromiseUpdateModel;
  }

  /**
   * Find all updates for a specific promise
   */
  static async findByPromiseId(promiseId: string): Promise<PromiseUpdateModel[]> {
    const allUpdates = await this.findAll() as PromiseUpdateModel[];
    return allUpdates.filter(update => update.promiseId === promiseId);
  }
}
