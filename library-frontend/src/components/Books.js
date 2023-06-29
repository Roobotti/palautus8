import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'
import Book from './Book'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }
  const allBooks = result.data.allBooks

  const genres = [...new Set(allBooks.flatMap((book) => book.genres))]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {allBooks
            .filter((book) => !genre || book.genres.includes(genre))
            .map((book) => (
              <Book key={book.title} book={book} />
            ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <i key={genre}>
            <button onClick={() => setGenre(genre)}> {genre} </button>
          </i>
        ))}
        <button onClick={() => setGenre(null)}> all genres </button>
      </div>
    </div>
  )
}

export default Books
