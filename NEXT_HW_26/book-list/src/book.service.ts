import { BookDto } from './book.model';

export class BookService {
  books = [];

  getAllBooks() {
    return this.books;
  }

  createBook(bookDto: BookDto) {
    const id = this.books.length + 1;
    this.books.push({ id: id.toString(), ...bookDto, createdDt: new Date() });
  }

  getBook(id) {
    const book = this.books.find((book) => {
      return book.id === id;
    });
    console.log(book);
    return book;
  }

  delete(id) {
    const filteredbooks = this.books.filter((book) => book.id !== id);
    this.books = [...filteredbooks];
  }

  updateBook(id, bookDto: BookDto) {
    let updateIndex = this.books.findIndex((book) => book.id === id);
    const updateBook = { id, ...bookDto, updatedDt: new Date() };
    this.books[updateIndex] = updateBook;
    return updateBook;
  }
}
