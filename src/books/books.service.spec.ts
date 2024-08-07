import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseService } from '../database/database.service';
import { BooksOrderBy, Order } from '../types';

const mockDatabase = {
  book: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

const now = new Date();

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: DatabaseService,
          useValue: mockDatabase,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return book', async () => {
      mockDatabase.book.create.mockResolvedValue({
        id: '12345',
        title: 'Book title',
        isbn: '12343212343',
        pages: 100,
        rating: 5,
        author: {
          id: '54321',
          name: 'John Doe',
          createdAt: now,
          updatedAt: now,
        },
      });

      const book = await service.create({
        title: 'Book title',
        author: {
          connect: {
            id: '54321',
          },
        },
        isbn: '12343212343',
        pages: 100,
        rating: 5,
      });

      expect(book.id).toEqual('12345');
      expect(book.title).toEqual('Book title');
      expect(book.isbn).toEqual('12343212343');
      expect(book.rating).toEqual(5);
      expect(book.pages).toEqual(100);
    });
  });

  describe('getBooks', () => {
    it('should return books without prev and next token', async () => {
      mockDatabase.book.findMany.mockResolvedValue([
        {
          id: '1',
          title: 'Book title 1',
          isbn: '12343212343',
          pages: 100,
          rating: 5,
          author: {
            id: '54321',
            name: 'John Doe',
            createdAt: now,
            updatedAt: now,
          },
        },
        {
          id: '2',
          title: 'Book title 2',
          isbn: '12343212343',
          pages: 100,
          rating: 5,
          author: {
            id: '54321',
            name: 'John Doe',
            createdAt: now,
            updatedAt: now,
          },
        },
      ]);

      const books = await service.getBooks({
        size: 2,
        search: 'book',
        orderBy: BooksOrderBy.CreatedAt,
        order: Order.Asc,
      });

      expect(books.data.length).toEqual(2);
      expect(books.prevToken).not.toBeDefined();
      expect(books.nextToken).not.toBeDefined();
    });

    it('should return books with next token', async () => {
      mockDatabase.book.findMany.mockResolvedValue([
        {
          id: '1',
          title: 'Book title 1',
          isbn: '12343212343',
          pages: 100,
          rating: 5,
          author: {
            id: '54321',
            name: 'John Doe',
            createdAt: now,
            updatedAt: now,
          },
        },
        {
          id: '2',
          title: 'Book title 2',
          isbn: '12343212343',
          pages: 100,
          rating: 5,
          author: {
            id: '54321',
            name: 'John Doe',
            createdAt: now,
            updatedAt: now,
          },
        },
        {
          id: '3',
          title: 'Book title 3',
          isbn: '12343212343',
          pages: 100,
          rating: 5,
          author: {
            id: '54321',
            name: 'John Doe',
            createdAt: now,
            updatedAt: now,
          },
        },
      ]);

      const books = await service.getBooks({
        size: 2,
        search: 'book',
        orderBy: BooksOrderBy.CreatedAt,
        order: Order.Asc,
      });

      expect(books.data.length).toEqual(2);
      expect(books.prevToken).not.toBeDefined();
      expect(books.nextToken).toEqual('2');
    });

    it('should return books with prev and next token', async () => {
      mockDatabase.book.findMany.mockResolvedValue([
        {
          id: '1',
          title: 'Book title 1',
          isbn: '12343212343',
          pages: 100,
          rating: 5,
          author: {
            id: '54321',
            name: 'John Doe',
            createdAt: now,
            updatedAt: now,
          },
        },
        {
          id: '2',
          title: 'Book title 2',
          isbn: '12343212343',
          pages: 100,
          rating: 5,
          author: {
            id: '54321',
            name: 'John Doe',
            createdAt: now,
            updatedAt: now,
          },
        },
        {
          id: '3',
          title: 'Book title 3',
          isbn: '12343212343',
          pages: 100,
          rating: 5,
          author: {
            id: '54321',
            name: 'John Doe',
            createdAt: now,
            updatedAt: now,
          },
        },
      ]);

      const books = await service.getBooks({
        size: 2,
        search: 'book',
        orderBy: BooksOrderBy.CreatedAt,
        order: Order.Asc,
        prevToken: '3',
      });

      expect(books.data.length).toEqual(2);
      expect(books.prevToken).toEqual('2');
      expect(books.nextToken).toEqual('3');
    });
  });
});
