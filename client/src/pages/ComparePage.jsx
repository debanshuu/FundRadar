import { useState, useEffect, useMemo } from 'react'
import { useCompare } from '../context/CompareContext'
import { searchFunds, getFundDetail } from '../services/api'
import { calculateReturn } from '../utils/cagr'
import ComparisonTable from '../components/ComparisonTable'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const COLORS = ['#5B2C8F', '#16A34A', '#DC2626']

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('-')
  return new Date(`${year}-${month}-${day}`)
}

function FundPicker({ onSelect, excludeCodes }) {
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
      const filtered = data.filter((f) => !excludeCodes.includes(String(f.schemeCode)))
      setResults(filtered.slice(0, 6))
    } catch {
      setResults([])
    }
  }

  return (
    <div className="compare-picker">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a fund to add"
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
    </div>
  )
}

function ComparePage() {
  const { basket, addToCompare, removeFromCompare, clearCompare } = useCompare()
  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (basket.length === 0) {
      setFunds([])
      return
    }

    setLoading(true)
    setError(null)

    Promise.all(basket.map((f) => getFundDetail(f.schemeCode)))
      .then((results) => setFunds(results))
      .catch(() => setError('Could not load comparison data. Please try again.'))
      .finally(() => setLoading(false))
  }, [basket])

  const chartData = useMemo(() => {
    if (funds.length === 0) return null

    const allDates = new Set()
    funds.forEach((fund) => {
      fund.data.forEach((entry) => allDates.add(entry.date))
    })

    const sortedDates = Array.from(allDates).sort((a, b) => parseDate(a) - parseDate(b))
    const oneYearAgo = new Date()
    oneYearAgo.setDate(oneYearAgo.getDate() - 365)
    const recentDates = sortedDates.filter((d) => parseDate(d) >= oneYearAgo)

    const datasets = funds.map((fund, i) => {
      const navMap = {}
      fund.data.forEach((entry) => {
        navMap[entry.date] = parseFloat(entry.nav)
      })

      return {
        label: fund.meta.scheme_name,
        data: recentDates.map((date) => navMap[date] ?? null),
        borderColor: COLORS[i],
        backgroundColor: 'transparent',
        spanGaps: true,
        tension: 0.2,
        pointRadius: 0
      }
    })

    return {
      labels: recentDates,
      datasets
    }
  }, [funds])

  const tableRows = [
    { label: '1M Return', getValue: (f) => calculateReturn(f.data, 30) ?? 0, format: (v) => `${v}%`, higherIsBetter: true },
    { label: '3M Return', getValue: (f) => calculateReturn(f.data, 90) ?? 0, format: (v) => `${v}%`, higherIsBetter: true },
    { label: '6M Return', getValue: (f) => calculateReturn(f.data, 180) ?? 0, format: (v) => `${v}%`, higherIsBetter: true },
    { label: '1Y Return', getValue: (f) => calculateReturn(f.data, 365) ?? 0, format: (v) => `${v}%`, higherIsBetter: true },
    { label: '3Y Return', getValue: (f) => calculateReturn(f.data, 365 * 3) ?? 0, format: (v) => `${v}%`, higherIsBetter: true },
    { label: 'Category', getValue: (f) => f.meta.scheme_category, higherIsBetter: false }
  ]

  const excludeCodes = basket.map((f) => String(f.schemeCode))

  return (
    <div className="compare-page">
      <h1>Compare Funds</h1>
      <p className="overlap-intro">
        Search and add up to 3 funds to compare side by side.
      </p>

      <div className="compare-basket">
        {basket.map((fund) => (
          <div key={fund.schemeCode} className="compare-chip">
            {fund.schemeName}
            <button onClick={() => removeFromCompare(fund.schemeCode)}>&times;</button>
          </div>
        ))}
        {basket.length > 0 && (
          <button className="clear-compare" onClick={clearCompare}>Clear all</button>
        )}
      </div>

      {basket.length < 3 && (
        <FundPicker
          onSelect={(fund) => addToCompare({ schemeCode: fund.schemeCode, schemeName: fund.schemeName })}
          excludeCodes={excludeCodes}
        />
      )}

      {basket.length === 0 && (
        <p className="search-status">Search for a fund above to start comparing.</p>
      )}

      {basket.length === 1 && (
        <p className="search-status">Add at least one more fund to see a comparison.</p>
      )}

      {loading && <p className="search-status">Loading comparison...</p>}
      {error && <p className="error-text">{error}</p>}

      {chartData && basket.length >= 2 && (
        <div className="nav-chart">
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: true, position: 'bottom' } } }} />
        </div>
      )}

      {funds.length >= 2 && (
        <ComparisonTable rows={tableRows} funds={funds} />
      )}
    </div>
  )
}

export default ComparePage