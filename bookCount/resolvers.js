const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    authorCount: async (root, args) => Author.collection.countDocuments(),
    bookCount: async (root, args) => Book.collection.countDocuments(),
    allAuthors: async (root, args) => {
      return Author.find({})
    },
    allBooks: async (root, args) => {
      const { author, genre } = args
      const query = {}
      if (author) query.author = author
      if (genre) query.genre = genre
      console.log(query)
      try {
        return Book.find(query)
      } catch (error) {
        throw new GraphQLError('finding book failed', {
          extensions: {
            code: 'BAD_ARGS_INPUT',
            invalidArgs: args,
            error,
          },
        })
      }
    },
    booksByGenre: async (root, args, context) => {
      try {
        const books = await Book.find({})
        return books.filter((book) =>
          book.genres.includes(context.currentUser.favoriteGenre)
        )
      } catch (error) {
        throw new GraphQLError('finding book failed', {
          extensions: {
            code: 'BAD_ARGS_INPUT',
            invalidArgs: args,
            error,
          },
        })
      }
    },

    findAuthor: async (root, args) => Author.findOne({ name: args.name }),
    findBook: async (root, args) => Book.findOne({ name: args.name }),
  },

  Author: {
    bookCount: async (args) => {
      return Book.countDocuments({ author: args })
    },
    name: async (args) => {
      const author = await Author.findOne(args)
      return author.name
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    addAuthor: async (root, args) => {
      const author = new Author({ ...args })
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_AUTHOR_INPUT',
            invalidArgs: args.name,
          },
        })
      }
      return author
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      console.log(author.born)
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving bornyear failed', {
          extensions: {
            code: 'BAD_NAME_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return author
    },

    addBook: async (root, args) => {
      if (await Book.findOne({ title: args.title })) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_AUTHOR_INPUT',
            invalidArgs: args.author,
            error,
          },
        })
      }
      const author = await Author.findOne({ name: args.author })

      if (!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_AUTHOR_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
        args.author = newAuthor
      } else {
        args.author = author
      }
      const book = new Book(args)

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_BOOK_INPUT',
            invalidArgs: args.author,
            error,
          },
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
