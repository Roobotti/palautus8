const Book = ({ book }) => {
  const { title, author, published } = book
  return (
    <tr>
      <td>{title}</td>
      <td>{author.name}</td>
      <td>{published}</td>
    </tr>
  )
}

export default Book
