import { BaseModel } from './BaseModel';
import path from 'path';

export interface UserData {
  id?: string;
  username: string;
  password: string; // In production, this should be hashed
  role: 'user' | 'admin';
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class UserModel extends BaseModel {
  username: string;
  password: string;
  role: 'user' | 'admin';
  email?: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: UserData) {
    super(data.id);
    this.username = data.username;
    this.password = data.password;
    this.role = data.role;
    this.email = data.email;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static getFilePath(): string {
    return path.join(process.cwd(), 'data', 'users.csv');
  }

  static getHeaders(): string[] {
    return ['id', 'username', 'password', 'role', 'email', 'createdAt', 'updatedAt'];
  }

  toCSVRow(): string[] {
    return [
      this.id,
      this.username,
      this.password,
      this.role,
      this.email || '',
      this.createdAt,
      this.updatedAt,
    ];
  }

  static fromCSVRow(row: string[]): UserModel {
    return new UserModel({
      id: row[0],
      username: row[1],
      password: row[2],
      role: row[3] as 'user' | 'admin',
      email: row[4] || undefined,
      createdAt: row[5],
      updatedAt: row[6],
    });
  }

  static create(data: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'>): UserModel {
    return new UserModel(data);
  }

  // Authentication helper methods
  static async findByUsername(username: string): Promise<UserModel | null> {
    const users = await this.findAll() as UserModel[];
    return users.find(user => user.username === username) || null;
  }

  validatePassword(password: string): boolean {
    // In production, use bcrypt to compare hashed passwords
    return this.password === password;
  }

  toSafeObject(): Omit<UserData, 'password'> {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
