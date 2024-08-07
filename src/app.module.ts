import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';

@Module({
  imports: [DatabaseModule, AuthorsModule, BooksModule],
  controllers: [AppController],
  providers: [AppService, providePrismaClientExceptionFilter()],
})
export class AppModule {}
