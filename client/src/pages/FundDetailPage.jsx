import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getFundDetail } from '../services/api'
import NavChart from '../components/NavChart'
import { calculateCAGR } from '../utils/cagr'
import { useCompare } from '../context/CompareContext'

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('-')
  return new Date(`${year}-${month}-${day}`)
}

function FundDetailPage() {
  const { schemeCode } = useParams()
  const { basket, addToCompare } = useCompare()
  const [fund, setFund] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [cagrAmount, setCagrAmount] = useState(10000)
  const [cagrDate, setCagrDate] = useState('')
  const [cagrResult, setCagrResult] = useState(null)
  const [cagrError, setCagrError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    getFundDetail(schemeCode)
      .then((data) => {
        setFund(data)
      })
      .catch(() => {
        setError('Could not load fund details. Please try again.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [schemeCode])

  const sortedData = useMemo(() => {
    if (!fund || !fund.data) return []
    return [...fund.data].sort((a, b) => parseDate(b.date) - parseDate(a.date))
  }, [fund])

  const isInactive = useMemo(() => {
    if (sortedData.length === 0) return false
    const latestDate = parseDate(sortedData[0].date)
    const oneYearAgo = new Date()
    oneYearAgo.setDate(oneYearAgo.getDate() - 365)
    return latestDate < oneYearAgo
  }, [sortedData])

  const keyStats = useMemo(() => {
    if (sortedData.length === 0) return null

    const currentNav = parseFloat(sortedData[0].nav)
    const latestDate = parseDate(sortedData[0].date)

    const oneYearBeforeLatest = new Date(latestDate)
    oneYearBeforeLatest.setDate(oneYearBeforeLatest.getDate() - 365)

    const lastYearData = sortedData.filter((entry) => parseDate(entry.date) >= oneYearBeforeLatest)

    const navValues = lastYearData.map((entry) => parseFloat(entry.nav))
    const high52 = navValues.length > 0 ? Math.max(...navValues) : currentNav
    const low52 = navValues.length > 0 ? Math.min(...navValues) : currentNav

    return { currentNav, high52, low52, lastUpdated: sortedData[0].date }
  }, [sortedData])

  function handleCagrSubmit(e) {
    e.preventDefault()
    setCagrError(null)
    setCagrResult(null)

    if (!fund || !fund.data || !cagrDate) return

    const result = calculateCAGR(fund.data, cagrDate, parseFloat(cagrAmount))

    if (!result) {
      setCagrError('No NAV data is available on or after that date for this fund. This fund may no longer be active.')
      return
    }

    setCagrResult(result)
  }

  if (loading) return <p>Loading fund details...</p>
  if (error) return <p className="error-text">{error}</p>
  if (!fund) return null

  return (
    <div className="fund-detail-page">
      <h1>{fund.meta.scheme_name}</h1>
      <p className="fund-meta">{fund.meta.fund_house} &middot; {fund.meta.scheme_category}</p>

      {isInactive && (
        <p className="inactive-warning">
          This fund appears to be inactive. Its NAV data last updated on {sortedData[0]?.date}, so stats below reflect its final trading period, not the present day.
        </p>
      )}

      {keyStats && (
        <div className="key-stats">
          <div>
            <span className="stat-label">{isInactive ? 'Final NAV' : 'Current NAV'}</span>
            <span className="stat-value">₹{keyStats.currentNav}</span>
          </div>
          <div>
            <span className="stat-label">52W High</span>
            <span className="stat-value">₹{keyStats.high52}</span>
          </div>
          <div>
            <span className="stat-label">52W Low</span>
            <span className="stat-value">₹{keyStats.low52}</span>
          </div>
          <div>
            <span className="stat-label">AUM</span>
            <span className="stat-value">Data not available</span>
          </div>
          <div>
            <span className="stat-label">Expense Ratio</span>
            <span className="stat-value">Data not available</span>
          </div>
          <div>
            <span className="stat-label">Last Updated</span>
            <span className="stat-value">{keyStats.lastUpdated}</span>
          </div>
        </div>
      )}

      <NavChart navHistory={fund.data} fundName={fund.meta.scheme_name} />

      {basket.some((f) => String(f.schemeCode) === String(schemeCode)) ? (
        <Link to="/compare" className="add-compare-button already-added">Added &middot; View Compare</Link>
      ) : (
        <button
          className="add-compare-button"
          disabled={basket.length >= 3}
          onClick={() => addToCompare({ schemeCode: fund.meta.scheme_code, schemeName: fund.meta.scheme_name })}
        >
          {basket.length >= 3 ? 'Compare basket full (max 3)' : 'Add to Compare'}
        </button>
      )}

      <div className="cagr-calculator">
        <h2>CAGR Calculator</h2>
        <form onSubmit={handleCagrSubmit}>
          <label>
            Investment Amount (₹)
            <input
              type="number"
              value={cagrAmount}
              onChange={(e) => setCagrAmount(e.target.value)}
              min="1"
              required
            />
          </label>

          <label>
            Investment Date
            <input
              type="date"
              value={cagrDate}
              onChange={(e) => setCagrDate(e.target.value)}
              required
            />
          </label>

          <button type="submit">Calculate</button>
        </form>

        {cagrError && <p className="error-text">{cagrError}</p>}

        {cagrResult && (
          <div className="cagr-result">
            <p>Invested ₹{cagrResult.investmentAmount} on {cagrResult.startDate}</p>
            <p>Current value: ₹{cagrResult.currentValue}</p>
            <p>Annualised return (CAGR): {cagrResult.cagr}%</p>
            <p>Holding period: {cagrResult.years} years</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FundDetailPage