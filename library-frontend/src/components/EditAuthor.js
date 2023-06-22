import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, MUTATE_AUTHOR } from '../queries'

const EditAuthor = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [mutateAuthor] = useMutation(MUTATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()

    mutateAuthor({
      variables: { name, born: parseInt(born) },
    })
    console.log('edit author...')

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {result.data.allAuthors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">set birthyear</button>
      </form>
    </div>
  )
}

export default EditAuthor
