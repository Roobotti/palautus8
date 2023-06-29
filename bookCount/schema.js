const typeDefs = `

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!,
  }
  
  type Mutation {
    addAuthor(
      author: String!
      born: Int!
    ): String

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token 
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    booksByGenre: [Book!]!
    findAuthor(name: String!): Author
    findBook(title: String!): Book
    me: User
  }

  type Subscription {
    bookAdded: Book!
    authorAdded: Book!
  } 
`
module.exports = typeDefs
