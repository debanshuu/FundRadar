import { useState } from 'react'
import { searchFunds, checkOverlap } from '../services/api'
import OverlapBar from '../components/OverlapBar'

function FundPicker({ label, onSelect, selected }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  async function handleChange(e) {
    const value = e.target.value
    setQuery(value)

    if (value.trim().length < 2) {
      setResults([])
      return
    }

    try {
      const data = await searchFunds(value)
      setResults(data.slice(0, 6))
    } catch {
      setResults([])
    }
  }

  return (
    <div className="overlap-picker">
      <label>{label}</label>
      {selected ? (
        <div className="overlap-selected-fund">
          {selected.schemeName}
          <button onClick={() => onSelect(null)}>&times;</button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for a fund"
          />
          {results.length > 0 && (
            <div className="overlap-results">
              {results.map((fund) => (
                <button
                  key={fund.schemeCode}
                  className="overlap-result-item"
                  onClick={() => {
                    onSelect(fund)
                    setQuery('')
                    setResults([])
                  }}
                >
                  {fund.schemeName}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function OverlapPage() {
  const [fundA, setFundA] = useState(null)
  const [fundB, setFundB] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleCheck() {
    setError(null)
    setResult(null)

    if (!fundA || !fundB) return

    setLoading(true)
    try {
      const data = await checkOverlap(fundA.schemeCode, fundB.schemeCode)
      setResult(data)
    } catch (err) {
      const message = err.response?.data?.error || 'Could not check overlap for these funds.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlap-page">
      <h1>Fund Overlap Checker</h1>
      <p className="overlap-intro">
        See how much two funds share in their top holdings before investing in both.
      </p>

      <div className="overlap-pickers">
        <FundPicker label="Fund A" onSelect={setFundA} selected={fundA} />
        <FundPicker label="Fund B" onSelect={setFundB} selected={fundB} />
      </div>

      <button
        className="check-overlap-button"
        onClick={handleCheck}
        disabled={!fundA || !fundB || loading}
      >
        {loading ? 'Checking...' : 'Check Overlap'}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="overlap-result-card">
          <OverlapBar
            overlapPercent={result.overlapPercent}
            fundAName={result.fundA.schemeName}
            fundBName={result.fundB.schemeName}
          />

          {result.overlappingStocks.length > 0 && (
            <table className="overlap-stocks-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>{result.fundA.schemeName}</th>
                  <th>{result.fundB.schemeName}</th>
                </tr>
              </thead>
              <tbody>
                {result.overlappingStocks.map((s) => (
                  <tr key={s.stock}>
                    <td>{s.stock}</td>
                    <td>{s.weightA}%</td>
                    <td>{s.weightB}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default OverlapPage