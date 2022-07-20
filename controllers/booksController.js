const { Op } = require("sequelize");
const ITEMS_PER_PAGE = 5;

//Importing helper function
const asyncHandler = require("./helpers/asyncHandler");
const cleanQuery = require("./helpers/cleanQuery");

//Importing Book model
const Book = require("../models").Book;

//Function that redirects to '/books'
exports.redirectToBooks = (req, res) => {
  res.redirect("books");
};

//Get all books + search functionality
exports.getAllBooks = async function (req, res, next) {
  const { query } = req.query;
  const finalQuery = cleanQuery(query);
  let books;
  let buttons;

  if (query === undefined || "") {
    buttons = Math.ceil((await Book.count()) / ITEMS_PER_PAGE);

    books = await Book.findAll({
      limit: ITEMS_PER_PAGE,
    });

    res.render("index", { books, buttons });
  } else {
    books = await Book.findAll({
      limit: ITEMS_PER_PAGE,

      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${finalQuery}%` } },
          { author: { [Op.like]: `%${finalQuery}%` } },
          { genre: { [Op.like]: `%${finalQuery}%` } },
          { year: { [Op.like]: `%${+finalQuery}%` } },
        ],
      },
    });

    buttons = Math.ceil((await Book.count()) / ITEMS_PER_PAGE);
    res.render("index", { books, buttons });
  }
};

//get books depending on page number
exports.getBooksPerPage = async function (req, res, next) {
  const { query } = req.query;
  const finalQuery = cleanQuery(query);
  const number = req.params.number;
  const offset = number * ITEMS_PER_PAGE - ITEMS_PER_PAGE;
  let books;
  let buttons;

  if (query === undefined || "") {
    buttons = Math.ceil((await Book.count()) / ITEMS_PER_PAGE);

    books = await Book.findAll({
      limit: ITEMS_PER_PAGE,
      offset,
    });

    res.render("index", { books, buttons });
  } else {
    books = await Book.findAll({
      limit: ITEMS_PER_PAGE,
      offset,

      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${finalQuery}%` } },
          { author: { [Op.like]: `%${finalQuery}%` } },
          { genre: { [Op.like]: `%${finalQuery}%` } },
          { year: { [Op.like]: `%${+finalQuery}%` } },
        ],
      },
    });

    buttons = Math.ceil((await Book.count()) / ITEMS_PER_PAGE);
    res.render("index", { books, buttons });
  }
};

//render book from search query

//render form to add a new book
exports.addBookForm = function (req, res, next) {
  res.render("new-book");
};

//Add a new book
exports.addNewBook = asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("new-book", { book, errors: error.errors });
    }
  }
});

//Get individual book information
exports.getOneBook = asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("update-book", { book });
});

//Update book information
exports.updateBook = asyncHandler(async (req, res) => {
  let book;

  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      article = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, errors: error.errors });
    }
  }
});

//Delete book
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  await book.destroy();

  res.redirect("/books");
});
