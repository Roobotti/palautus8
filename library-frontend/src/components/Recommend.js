import { useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE, ME } from '../queries'
import { useState, useEffect } from 'react'

import Book from './Book'

const Recommend = (props) => {
  const resultB = useQuery(BOOKS_BY_GENRE)
  const resultA = useQuery(ME)

  if (resultB.loading || resultA.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }
  const books = resultB.data.booksByGenre
  const genre = resultA.data.me.favoriteGenre

  return (
    <div>
      <h2>recommendations</h2>
      <>books in your favorite genre {genre}</>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <Book key={book.title} book={book} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
