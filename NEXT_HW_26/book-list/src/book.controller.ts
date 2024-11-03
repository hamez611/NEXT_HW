import {
  Controller,
  Param,
  Body,
  Delete,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto } from './book.model';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {} // DI 사용

  @Get()
  getAllBooks() {
    console.log('모든 게시글 가져오기');
    return this.bookService.getAllBooks();
  }

  @Post()
  createBook(@Body() bookDto: BookDto) {
    console.log('게시글 작성');
    this.bookService.createBook(bookDto);
    return 'success';
  }

  @Get('/:id')
  getBook(@Param('id') id: string) {
    console.log('게시글 하나 가져오기');
    return this.bookService.getBook(id);
  }

  @Delete('/:id')
  deleteBook(@Param('id') id: string) {
    console.log('게시글 삭제');
    this.bookService.delete(id);
    return 'success';
  }

  @Put('/:id')
  updateBook(@Param('id') id: string, @Body() bookDto: BookDto) {
    console.log('게시글 업데이트', id, bookDto);
    return this.bookService.updateBook(id, bookDto);
  }
}
