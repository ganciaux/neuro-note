// users.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findActiveAdmins(): Promise<User[]> {
    return this.createQueryBuilder('u')
      .where('u.roleCode = :role', { role: 'admin' })
      .andWhere('u.isActive = true')
      .orderBy('u.createdAt', 'DESC')
      .getMany();
  }

  async search(filters: { email?: string; name?: string }): Promise<User[]> {
    const qb = this.createQueryBuilder('user');

    if (filters.email) {
      qb.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
        email: `%${filters.email}%`,
      });
    }

    if (filters.name) {
      qb.andWhere('LOWER(user.fullName) LIKE LOWER(:name)', {
        name: `%${filters.name}%`,
      });
    }

    return qb.getMany();
  }

  async searchTerm(term: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.fullName ILIKE :term', { term: `%${term}%` })
      .orWhere('user.email ILIKE :term', { term: `%${term}%` })
      .getMany();
  }
}
