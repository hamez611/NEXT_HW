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

@Controller('book')
export class BookController {
  bookService: BookService;
  constructor() {
    this.bookService = new BookService();
  }

  @Get()
  getAllPosts() {
    console.log('모든 게시글 가져오기');
    return this.bookService.getAllBooks();
  }

  @Post()
  createPost(@Body() bookDto) {
    console.log('게시글 작성');
    this.bookService.createBook(bookDto);
    return 'success';
  }

  @Get('/:id')
  getPost(@Param('id') id: string) {
    console.log(['게시글 하나 가져오기']);
    return this.bookService.getBook(id);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    console.log('게시글 삭제');
    this.bookService.delete(id);
    return 'success';
  }

  @Put('/:id')
  updatePost(@Param('id') id: string, @Body() bookDto) {
    console.log('게시글 업데이트', id, bookDto);
    return this.bookService.updateBook(id, bookDto);
  }
}
