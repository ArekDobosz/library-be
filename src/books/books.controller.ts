import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book, Prisma } from '@prisma/client';
import { EnumValidationPipe } from '../utils/validation/validation.pipe';
import { BooksOrderBy, Order, PaginationResult } from '../types';
import { DEFAULT_PAGE_SIZE } from '../consts';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: Prisma.BookCreateInput): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  getBooks(
    @Query('nextToken') nextToken: string,
    @Query('prevToken') prevToken: string,
    @Query('size', new DefaultValuePipe(DEFAULT_PAGE_SIZE)) size: number,
    @Query('search') search: string,
    @Query(
      'orderBy',
      new DefaultValuePipe(BooksOrderBy.CreatedAt),
      new EnumValidationPipe(BooksOrderBy),
    )
    orderBy: BooksOrderBy,
    @Query(
      'order',
      new DefaultValuePipe(Order.Asc),
      new EnumValidationPipe(Order),
    )
    order: Order,
  ): Promise<PaginationResult<Book>> {
    return this.booksService.getBooks({
      nextToken,
      prevToken,
      size: +size,
      search,
      orderBy,
      order,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: Prisma.BookUpdateInput,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Book> {
    return this.booksService.remove(id);
  }
}
