import { useState, useEffect } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (query.trim().length < 2) return

    const timeout = setTimeout(() => {
      onSearch(query)
    }, 400)

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search funds by name or AMC"
      className="search-input"
    />
  )
}

export default SearchBar