import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { BooksOrderBy, Order } from '../types';
import { DEFAULT_PAGE_SIZE } from '../consts';

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createBookDto: Prisma.BookCreateInput) {
    try {
      return this.databaseService.book.create({ data: createBookDto });
    } catch (error) {}
  }

  async getBooks({
    nextToken,
    prevToken,
    size = DEFAULT_PAGE_SIZE,
    search = '',
    orderBy = BooksOrderBy.CreatedAt,
    order = Order.Desc,
  }: {
    nextToken?: string;
    prevToken?: string;
    size: number;
    search: string;
    orderBy: BooksOrderBy;
    order: Order;
  }) {
    const take = size + 1; // +1 to see if we have further results
    const cursor = nextToken ?? prevToken;

    const bookFindManyArgs: Prisma.BookFindManyArgs = {
      take: cursor && prevToken ? -take : take,
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            author: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: { author: true },
      orderBy: {
        ...(orderBy !== BooksOrderBy.Author
          ? { [orderBy]: order }
          : { author: { name: order } }),
      },
    };

    const [books, booksPrevOrNextPageItem] = await Promise.all([
      this.databaseService.book.findMany(bookFindManyArgs),
      ...(nextToken || prevToken
        ? [
            this.databaseService.book.findMany({
              ...bookFindManyArgs,
              take: prevToken ? 1 : -1,
            }),
          ]
        : [null]),
    ]);

    if (prevToken) {
      const booksResponse =
        books.length === take ? books.slice(1, books.length) : books;
      return {
        data: booksResponse,
        prevToken: books.length === take ? booksResponse[0]?.id : undefined,
        nextToken: booksResponse[booksResponse.length - 1]?.id,
      };
    }

    const booksResponse =
      books.length === take ? books.slice(0, books.length - 1) : books;
    return {
      data: booksResponse,
      nextToken:
        books.length === take
          ? booksResponse[booksResponse.length - 1]?.id
          : undefined,
      prevToken:
        booksPrevOrNextPageItem?.length > 0 || nextToken
          ? booksResponse[0]?.id
          : undefined,
    };
  }

  findOne(id: string) {
    return this.databaseService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  update(id: string, updateBookDto: Prisma.BookUpdateInput) {
    return this.databaseService.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  remove(id: string) {
    return this.databaseService.book.delete({ where: { id } });
  }
}
