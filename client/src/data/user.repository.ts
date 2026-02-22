import { BaseRepository } from './base.repository';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository extends BaseRepository {
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    }) as Promise<User | null>;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<User | null>;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...userData,
        role: userData.role as any,
      },
    }) as Promise<User>;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        role: userData.role as any,
      },
    }) as Promise<User>;
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    }) as Promise<User>;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    where?: any;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      ...options,
    }) as Promise<User[]>;
  }
}

export const userRepository = new UserRepository();
