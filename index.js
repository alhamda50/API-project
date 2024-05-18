const express = require("express");
const bodyParser = require("body-parser");

// Database
const database = require("./database");

// Initialize express
const booky = express();

booky.use(bodyParser.urlencoded({ extended: true }));
booky.use(bodyParser.json());

/*
Route                 /
Description           Get all the books
Access                PUBLIC
Parameter             NONE
Methods               GET
*/
booky.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
Route                 /is
Description           Get specific book based on ISBN
Access                PUBLIC
Parameter             isbn
Methods               GET
*/
booky.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );
  if (getSpecificBook.length === 0) {
    return res.json({ error: `No specific book for the ISBN of ${req.params.isbn}` });
  }
  return res.json({ book: getSpecificBook });
});

/*
Route                 /c
Description           Get specific book based on category
Access                PUBLIC
Parameter             category
Methods               GET
*/
booky.get("/c/:category", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  );
  if (getSpecificBook.length === 0) {
    return res.json({ error: `No specific book based on the category ${req.params.category}` });
  }
  return res.json({ book: getSpecificBook });
});

/*
Route                 /l
Description           Get specific book based on language
Access                PUBLIC
Parameter             language
Methods               GET
*/
booky.get("/l/:language", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
  );
  if (getSpecificBook.length === 0) {
    return res.json({ error: `No book in the language ${req.params.language}` });
  }
  return res.json({ book: getSpecificBook });
});

/*
Route                 /a
Description           Get all authors
Access                PUBLIC
Parameter             NONE
Methods               GET
*/
booky.get("/a", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
Route                 /auth
Description           Get specific author
Access                PUBLIC
Parameter             id
Methods               GET
*/
booky.get("/auth/:id", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.id === parseInt(req.params.id)
  );
  if (getSpecificAuthor.length === 0) {
    return res.json({ error: `No author found with the ID ${req.params.id}` });
  }
  return res.json({ author: getSpecificAuthor });
});

/*
Route                 /auth/book
Description           Get a list of authors based on books
Access                PUBLIC
Parameter             isbn
Methods               GET
*/
booky.get("/auth/book/:isbn", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.books.includes(req.params.isbn)
  );
  if (getSpecificAuthor.length === 0) {
    return res.json({ error: `No author found for the book with ISBN ${req.params.isbn}` });
  }
  return res.json({ author: getSpecificAuthor });
});

/*
Route                 /pub
Description           Get all publications
Access                PUBLIC
Parameter             NONE
Methods               GET
*/
booky.get("/pub", (req, res) => {
  return res.json({ publications: database.publications });
});

/*
Route                 /pub/:id
Description           Get a specific publication
Access                PUBLIC
Parameter             id
Methods               GET
*/
booky.get("/pub/:id", (req, res) => {
  const getSpecificPublication = database.publications.filter(
    (publication) => publication.id === parseInt(req.params.id)
  );
  if (getSpecificPublication.length === 0) {
    return res.json({ error: `No specific publications found with the ID ${req.params.id}` });
  }
  return res.json({ publication: getSpecificPublication });
});

/*
Route                 /pub/book/:isbn
Description           Get a list of publications based on a book
Access                PUBLIC
Parameter             isbn
Methods               GET
*/
booky.get("/pub/book/:isbn", (req, res) => {
  const getSpecificPublication = database.publications.filter(
    (publication) => publication.books.includes(req.params.isbn)
  );
  if (getSpecificPublication.length === 0) {
    return res.json({ error: `No specific publications for the book with ISBN ${req.params.isbn}` });
  }
  return res.json({ publication: getSpecificPublication });
});

/********** POST ************/
/*
Route                 /books/new
Description           Add new book
Access                PUBLIC
Parameter             NONE
Methods               POST
*/
booky.post("/books/new", (req, res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json(database.books);
});

/*
Route                 /publications/new
Description           Add new publication
Access                PUBLIC
Parameter             NONE
Methods               POST
*/
booky.post("/publications/new", (req, res) => {
  const newPublication = req.body;
  database.publications.push(newPublication);
  return res.json({ updatedPub: database.publications });
});

/*
Route                 /authors/new
Description           Add new author
Access                PUBLIC
Parameter             NONE
Methods               POST
*/
booky.post("/authors/new", (req, res) => {
  const newAuthor = req.body;
  database.authors.push(newAuthor);
  return res.json(database.authors);
});

/********** PUT ************/
/*
Route                 /publications/update/books/:isbn
Description           Update/add new publication
Access                PUBLIC
Parameter             isbn
Methods               PUT
*/
booky.put("/publications/update/books/:isbn", (req, res) => {
  // Update the publications database
  database.publications.forEach((pub) => {
    if (pub.id === req.body.pubId) {
      pub.books.push(req.params.isbn);
    }
  });

  // Update books database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "Update successful"
  });
});

/********** DELETE ************/
/*
Route                 /books/delete
Description           Delete a book
Access                PUBLIC
Parameter             isbn
Methods               DELETE
*/

booky.delete("/books/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );
  database.books = updatedBookDatabase;
  return res.json({ books: database.books });
});

/*
Route                 /book/delete/author
Description           Delete author from book and related book from author
Access                PUBLIC
Parameter             isbn, authorId
Methods               DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  // update books Database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });

  // update authors database
  database.authors.forEach((eachAuthor) => {
    if (eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    books: database.books,
    authors: database.authors,
    message: "successfully deleted"
  });
});



/*
Route                 /book/delete/author
Description           Delete author from book
Access                PUBLIC
Parameter             isbn, authorId
Methods               DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  // update books Database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });
  return res.json({
    books: database.books,
    message: "successfully deleted"
  });
});


booky.listen(3000, () => {
  console.log("Server is up and running");
});
