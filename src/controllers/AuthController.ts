import { BaseController } from './BaseController';
import { UserModel, UserData } from '@/models';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  email?: string;
  role?: 'user' | 'admin';
}

export class AuthController extends BaseController {
  /**
   * Authenticate user with username and password
   */
  static async login(credentials: LoginCredentials) {
    try {
      // Validate input
      const validation = this.prototype.validateRequired(credentials, ['username', 'password']);
      if (!validation.valid) {
        return {
          success: false,
          error: `Missing required fields: ${validation.missing.join(', ')}`,
        };
      }

      // Find user by username
      const user = await UserModel.findByUsername(credentials.username);
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid username or password',
        };
      }

      // Validate password
      if (!user.validatePassword(credentials.password)) {
        return {
          success: false,
          error: 'Invalid username or password',
        };
      }

      // Return user without password
      return {
        success: true,
        data: user.toSafeObject(),
      };
    } catch (error) {
      return {
        success: false,
        ...this.prototype.handleError(error),
      };
    }
  }

  /**
   * Register a new user
   */
  static async register(data: RegisterData) {
    try {
      // Validate input
      const validation = this.prototype.validateRequired(data, ['username', 'password']);
      if (!validation.valid) {
        return {
          success: false,
          error: `Missing required fields: ${validation.missing.join(', ')}`,
        };
      }

      // Check if username already exists
      const existingUser = await UserModel.findByUsername(data.username);
      if (existingUser) {
        return {
          success: false,
          error: 'Username already exists',
        };
      }

      // Validate password strength (basic)
      if (data.password.length < 4) {
        return {
          success: false,
          error: 'Password must be at least 4 characters',
        };
      }

      // Create new user (default role is 'user')
      const user = UserModel.create({
        username: data.username,
        password: data.password, // In production, hash this
        role: data.role || 'user',
        email: data.email,
      });

      await user.save();

      return {
        success: true,
        data: user.toSafeObject(),
      };
    } catch (error) {
      return {
        success: false,
        ...this.prototype.handleError(error),
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string) {
    try {
      const user = await UserModel.findById(id) as UserModel | null;
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: user.toSafeObject(),
      };
    } catch (error) {
      return {
        success: false,
        ...this.prototype.handleError(error),
      };
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers() {
    try {
      const users = await UserModel.findAll() as UserModel[];
      const safeUsers = users.map(user => user.toSafeObject());
      
      return {
        success: true,
        data: safeUsers,
      };
    } catch (error) {
      return {
        success: false,
        ...this.prototype.handleError(error),
      };
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(id: string) {
    try {
      const user = await UserModel.findById(id) as UserModel | null;
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      await UserModel.delete(id);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        ...this.prototype.handleError(error),
      };
    }
  }
}
