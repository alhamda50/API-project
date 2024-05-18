const books = [
  {
    ISBN: "1234Book",
    name: "Tesla",
    language: "en",
    pubDate: "2024-05-13",
    numPage: 250,
    publication: [1],
    author: [1,2],
    category: ["Tech", "Space", "Education"]
  },
  {
    ISBN: "101Book",
    name: "Two states",
    language: "en",
    pubDate: "2024-05-18",
    numPage: 450,
    publication: [3],
    author: [2],
    category: ["Education"]
  }

]

const authors = [
  {
    id: 1,
    name: "Alhamda",
    books: ["1234Book", "secretBook"]
  },
  {
    id: 2,
    name: "Elon Musk",
    books: ["1234Book"]
  }
]

const publications = [
  {
    id: 1,
    name: "writex",
    books: ["1234Book"]
  },
  {
    id: 2,
    name: "xyz",
    books: ["Harry Potter", "secretBook"]
  },
  {
    id: 3,
    name: "abc",
    books: []
  }
]

module.exports = {books, authors, publications};
