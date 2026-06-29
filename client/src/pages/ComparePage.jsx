import { useState, useEffect, useMemo } from 'react'
import { useCompare } from '../context/CompareContext'
import { getFundDetail } from '../services/api'
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

function ComparePage() {
  const { basket, removeFromCompare, clearCompare } = useCompare()
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

  if (basket.length === 0) {
    return (
      <div className="compare-page">
        <h1>Compare Funds</h1>
        <p>You haven't added any funds yet. Go to a fund's detail page and tap "Add to Compare" to get started.</p>
      </div>
    )
  }

  return (
    <div className="compare-page">
      <h1>Compare Funds</h1>

      <div className="compare-basket">
        {basket.map((fund) => (
          <div key={fund.schemeCode} className="compare-chip">
            {fund.schemeName}
            <button onClick={() => removeFromCompare(fund.schemeCode)}>&times;</button>
          </div>
        ))}
        <button className="clear-compare" onClick={clearCompare}>Clear all</button>
      </div>

      {loading && <p>Loading comparison...</p>}
      {error && <p className="error-text">{error}</p>}

      {chartData && (
        <div className="nav-chart">
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: true, position: 'bottom' } } }} />
        </div>
      )}

      {funds.length > 0 && (
        <ComparisonTable rows={tableRows} funds={funds} />
      )}
    </div>
  )
}

export default ComparePage
