/**
 * Promise Controller
 * 
 * Handles business logic for promises including CRUD operations and validation.
 */

import { BaseController } from './BaseController';
import { PromiseModel, PromiseStatus, PromiseWithPolitician } from '@/models/PromiseModel';

export class PromiseController extends BaseController {
  /**
   * Get all promises with politician information, sorted by date
   */
  async getAllPromises(sortBy: 'createdAt' | 'updatedAt' | 'promiseDate' = 'createdAt', order: 'asc' | 'desc' = 'desc'): Promise<PromiseWithPolitician[]> {
    try {
      const promises = await PromiseModel.findAllWithPoliticians();
      
      // Sort by the specified field
      return promises.sort((a, b) => {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } catch (error) {
      throw new Error(`Failed to fetch promises: ${error}`);
    }
  }

  /**
   * Get a single promise by ID with politician information
   */
  async getPromiseById(id: string): Promise<PromiseWithPolitician | null> {
    try {
      return await PromiseModel.findByIdWithPolitician(id);
    } catch (error) {
      throw new Error(`Failed to fetch promise: ${error}`);
    }
  }

  /**
   * Create a new promise
   */
  async createPromise(data: {
    politicianId: string;
    name: string;
    details: string;
    promiseDate: string;
    status?: PromiseStatus;
  }): Promise<PromiseWithPolitician> {
    try {
      // Validate required fields
      const validation = this.validateRequired(data, [
        'politicianId',
        'name',
        'details',
        'promiseDate',
      ]);

      if (!validation.valid) {
        throw new Error(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      // Create the promise
      const promise = await PromiseModel.create(data);
      
      // Return with politician info
      const promiseWithPolitician = await PromiseModel.findByIdWithPolitician(promise.id);
      if (!promiseWithPolitician) {
        throw new Error('Failed to retrieve created promise');
      }
      
      return promiseWithPolitician;
    } catch (error) {
      throw new Error(`Failed to create promise: ${error}`);
    }
  }

  /**
   * Update an existing promise
   */
  async updatePromise(
    id: string,
    data: Partial<{
      politicianId: string;
      name: string;
      details: string;
      promiseDate: string;
      status: PromiseStatus;
    }>
  ): Promise<PromiseWithPolitician | null> {
    try {
      const promise = await PromiseModel.findById(id) as PromiseModel | null;
      
      if (!promise) {
        return null;
      }

      // Update fields
      if (data.politicianId !== undefined) promise.politicianId = data.politicianId;
      if (data.name !== undefined) promise.name = data.name;
      if (data.details !== undefined) promise.details = data.details;
      if (data.promiseDate !== undefined) promise.promiseDate = data.promiseDate;
      if (data.status !== undefined) promise.status = data.status;
      
      promise.updatedAt = new Date().toISOString();
      
      await promise.save();
      
      return await PromiseModel.findByIdWithPolitician(id);
    } catch (error) {
      throw new Error(`Failed to update promise: ${error}`);
    }
  }

  /**
   * Delete a promise
   */
  async deletePromise(id: string): Promise<boolean> {
    try {
      return await PromiseModel.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete promise: ${error}`);
    }
  }

  /**
   * Get promises by politician ID
   */
  async getPromisesByPolitician(politicianId: string): Promise<PromiseWithPolitician[]> {
    try {
      const allPromises = await this.getAllPromises();
      return allPromises.filter(p => p.politicianId === politicianId);
    } catch (error) {
      throw new Error(`Failed to fetch promises by politician: ${error}`);
    }
  }

  /**
   * Get promises by status
   */
  async getPromisesByStatus(status: PromiseStatus): Promise<PromiseWithPolitician[]> {
    try {
      const allPromises = await this.getAllPromises();
      return allPromises.filter(p => p.status === status);
    } catch (error) {
      throw new Error(`Failed to fetch promises by status: ${error}`);
    }
  }
}
