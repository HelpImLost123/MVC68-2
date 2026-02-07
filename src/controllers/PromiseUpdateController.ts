/**
 * PromiseUpdate Controller
 * 
 * Handles business logic for promise updates
 */

import { BaseController } from './BaseController';
import { PromiseUpdateModel } from '@/models/PromiseUpdateModel';
import { PromiseModel, PromiseStatus } from '@/models/PromiseModel';

export class PromiseUpdateController extends BaseController {
  /**
   * Get all updates for a specific promise
   */
  async getUpdatesByPromiseId(promiseId: string): Promise<PromiseUpdateModel[]> {
    try {
      const updates = await PromiseUpdateModel.findByPromiseId(promiseId);
      
      // Sort by date descending (newest first)
      updates.sort((a, b) => {
        return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime();
      });
      
      return updates;
    } catch (error) {
      throw new Error(`Failed to fetch updates: ${error}`);
    }
  }

  /**
   * Create a new update and update the promise status
   */
  async createUpdate(data: {
    promiseId: string;
    details: string;
    newStatus: PromiseStatus;
  }): Promise<PromiseUpdateModel> {
    // Validate required fields
    const validation = this.validateRequired(data, ['promiseId', 'details', 'newStatus']);
    if (!validation.valid) {
      throw new Error(`Missing required fields: ${validation.missing.join(', ')}`);
    }

    try {
      // Check if promise exists
      const promise = await PromiseModel.findById(data.promiseId) as PromiseModel | null;
      if (!promise) {
        throw new Error('Promise not found');
      }

      // Create the update record
      const update = await PromiseUpdateModel.create({
        promiseId: data.promiseId,
        details: data.details,
        newStatus: data.newStatus,
      });

      // Update the promise status
      promise.status = data.newStatus;
      promise.updatedAt = new Date().toISOString();
      await promise.save();

      return update;
    } catch (error) {
      throw new Error(`Failed to create update: ${error}`);
    }
  }

  /**
   * Get all updates (for admin purposes)
   */
  async getAllUpdates(): Promise<PromiseUpdateModel[]> {
    try {
      const updates = await PromiseUpdateModel.findAll() as PromiseUpdateModel[];
      
      // Sort by date descending
      updates.sort((a, b) => {
        return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime();
      });
      
      return updates;
    } catch (error) {
      throw new Error(`Failed to fetch all updates: ${error}`);
    }
  }
}
