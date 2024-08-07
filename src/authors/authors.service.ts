import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { DatabaseService } from '../database/database.service';
import { DEFAULT_PAGE_SIZE } from '../consts';
import { Order } from '../types';

@Injectable()
export class AuthorsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createAuthorDto: Prisma.AuthorCreateInput) {
    return this.databaseService.author.create({ data: createAuthorDto });
  }

  findAll() {
    return this.databaseService.author.findMany({
      take: DEFAULT_PAGE_SIZE,
      include: { books: true },
      orderBy: { createdAt: Order.Desc },
    });
  }

  findOne(id: string) {
    return this.databaseService.author.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  update(id: string, updateAuthorDto: Prisma.AuthorUpdateInput) {
    return this.databaseService.author.update({
      where: { id },
      data: updateAuthorDto,
    });
  }

  remove(id: string) {
    return this.databaseService.author.delete({ where: { id } });
  }
}
