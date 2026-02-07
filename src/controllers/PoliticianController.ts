/**
 * Politician Controller
 * 
 * Handles business logic for politician operations.
 */

import { BaseController } from './BaseController';
import { PoliticianModel } from '@/models/PoliticianModel';
import { CampaignModel } from '@/models/CampaignModel';
import { PromiseModel } from '@/models/PromiseModel';

export interface PoliticianWithArea {
  id: string;
  name: string;
  partyName: string;
  portraitUrl: string;
  area: string;
}

export class PoliticianController extends BaseController {
  /**
   * Get all politicians with their areas from latest campaigns
   */
  async getAll() {
    try {
      const politicians = await PoliticianModel.findAll() as PoliticianModel[];
      
      // Fetch area for each politician from their latest campaign
      const politiciansWithArea: PoliticianWithArea[] = await Promise.all(
        politicians.map(async (politician) => {
          const latestCampaign = await CampaignModel.getLatestByPoliticianId(politician.id);
          return {
            id: politician.id,
            name: politician.name,
            partyName: politician.partyName,
            portraitUrl: politician.portraitUrl,
            area: latestCampaign?.areaName || 'ไม่ระบุ',
          };
        })
      );
      
      return {
        success: true,
        data: politiciansWithArea,
      };
    } catch (error) {
      return {
        success: false,
        ...this.handleError(error),
      };
    }
  }

  /**
   * Get a single politician by ID with area from latest campaign
   */
  async getById(id: string) {
    try {
      const politician = await PoliticianModel.findById(id) as PoliticianModel | null;
      
      if (!politician) {
        return {
          success: false,
          error: 'Politician not found',
        };
      }

      const latestCampaign = await CampaignModel.getLatestByPoliticianId(id);
      const politicianWithArea: PoliticianWithArea = {
        id: politician.id,
        name: politician.name,
        partyName: politician.partyName,
        portraitUrl: politician.portraitUrl,
        area: latestCampaign?.areaName || 'ไม่ระบุ',
      };

      return {
        success: true,
        data: politicianWithArea,
      };
    } catch (error) {
      return {
        success: false,
        ...this.handleError(error),
      };
    }
  }

  /**
   * Get a politician with all their promises and area from latest campaign
   */
  async getWithPromises(id: string) {
    try {
      const politician = await PoliticianModel.findById(id) as PoliticianModel | null;
      
      if (!politician) {
        return {
          success: false,
          error: 'Politician not found',
        };
      }

      // Get area from latest campaign
      const latestCampaign = await CampaignModel.getLatestByPoliticianId(id);
      const politicianWithArea: PoliticianWithArea = {
        id: politician.id,
        name: politician.name,
        partyName: politician.partyName,
        portraitUrl: politician.portraitUrl,
        area: latestCampaign?.areaName || 'ไม่ระบุ',
      };

      // Get all promises for this politician
      const allPromises = await PromiseModel.findAll() as PromiseModel[];
      const promises = allPromises.filter(p => p.politicianId === id);

      return {
        success: true,
        data: {
          politician: politicianWithArea,
          promises,
        },
      };
    } catch (error) {
      return {
        success: false,
        ...this.handleError(error),
      };
    }
  }

  /**
   * Create a new politician
   */
  async create(data: {
    name: string;
    partyName: string;
    portraitUrl?: string;
  }) {
    try {
      // Validate required fields
      const validation = this.validateRequired(data, ['name', 'partyName']);
      
      if (!validation.valid) {
        return {
          success: false,
          error: `Missing required fields: ${validation.missing.join(', ')}`,
        };
      }

      const politician = await PoliticianModel.create(data);

      return {
        success: true,
        data: politician,
      };
    } catch (error) {
      return {
        success: false,
        ...this.handleError(error),
      };
    }
  }

  /**
   * Update a politician
   */
  async update(id: string, data: Partial<{
    name: string;
    partyName: string;
    portraitUrl: string;
  }>) {
    try {
      const politician = await PoliticianModel.findById(id) as PoliticianModel | null;
      
      if (!politician) {
        return {
          success: false,
          error: 'Politician not found',
        };
      }

      // Update fields
      if (data.name !== undefined) politician.name = data.name;
      if (data.partyName !== undefined) politician.partyName = data.partyName;
      if (data.portraitUrl !== undefined) politician.portraitUrl = data.portraitUrl;

      await politician.save();

      return {
        success: true,
        data: politician,
      };
    } catch (error) {
      return {
        success: false,
        ...this.handleError(error),
      };
    }
  }

  /**
   * Delete a politician
   */
  async delete(id: string) {
    try {
      await PoliticianModel.delete(id);

      return {
        success: true,
        message: 'Politician deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        ...this.handleError(error),
      };
    }
  }
}
