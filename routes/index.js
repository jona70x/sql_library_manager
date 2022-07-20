const express = require("express");
const router = express.Router();

//Importing helper functions
const asyncHandler = require("../controllers/helpers/asyncHandler");
const {
  redirectToBooks,
  getAllBooks,
  getBooksPerPage,
  addBookForm,
  addNewBook,
  getOneBook,
  updateBook,
  deleteBook,
} = require("../controllers/booksController");

//Mounting routes
router.get("/", redirectToBooks);
router.get("/books", getAllBooks);
router.get("/books/page:number", getBooksPerPage);
router.get("/books/new", addBookForm);
router.post("/books/new", addNewBook);
router.get("/books/:id", getOneBook);
router.post("/books/:id", updateBook);
router.post("/books/:id/delete", deleteBook);

module.exports = router;
