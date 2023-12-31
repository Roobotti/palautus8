import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import EditAuthor from './EditAuthor'

const Authors = ({ show, setError }) => {
  console.log('heh')
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    console.log('loading')
    return <div>loading...</div>
  }

  if (!show) {
    return null
  }
  console.log(result.data)
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthor setError={setError} />
    </div>
  )
}

export default Authors
