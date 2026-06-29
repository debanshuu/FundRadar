import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import FundCard from '../components/FundCard'
import { searchFunds } from '../services/api'

function SearchPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSearch(query) {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    try {
      const data = await searchFunds(query)
      setResults(data)
    } catch {
      setError('Something went wrong while searching. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-page">

      <div className="search-hero">
        <div className="hero-badge">🇮🇳 Indian Mutual Funds</div>
        <h1>Find & Compare<br />Mutual Funds</h1>
        <p className="search-subtitle">
          Real NAV data · Side-by-side comparison · Holdings overlap checker
        </p>
        <SearchBar onSearch={handleSearch} />
      </div>

      {!hasSearched && (
        <div className="feature-cards">
          <div className="feature-card">
            <div>
              <div className="feature-title">NAV History</div>
              <div className="feature-desc">Track NAV trends from 1 week to 3 years</div>
            </div>
          </div>
          <div className="feature-card">
            <div>
              <div className="feature-title">Compare Funds</div>
              <div className="feature-desc">Side-by-side returns across any time period</div>
            </div>
          </div>
          <div className="feature-card">
            <div>
              <div className="feature-title">Overlap Checker</div>
              <div className="feature-desc">See shared holdings between two funds</div>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="search-status">Searching...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && hasSearched && results.length === 0 && !error && (
        <p className="search-status">No funds found. Try a different search term.</p>
      )}
      {hasSearched && !loading && (
        <div className="fund-results">
          {results.map((fund) => (
            <FundCard key={fund.schemeCode} fund={fund} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage