import { useState, useMemo } from 'react'
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

const RANGES = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  '3Y': 365 * 3
}

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('-')
  return new Date(`${year}-${month}-${day}`)
}

function NavChart({ navHistory, fundName }) {
  const [range, setRange] = useState('1Y')

  const sorted = useMemo(() => {
    if (!navHistory || navHistory.length === 0) return []
    return [...navHistory].sort((a, b) => parseDate(a.date) - parseDate(b.date))
  }, [navHistory])

  const filteredData = useMemo(() => {
    if (sorted.length === 0) return []

    const latestDate = parseDate(sorted[sorted.length - 1].date)
    const days = RANGES[range]
    const cutoff = new Date(latestDate)
    cutoff.setDate(cutoff.getDate() - days)

    return sorted.filter((entry) => parseDate(entry.date) >= cutoff)
  }, [sorted, range])

  const chartData = {
    labels: filteredData.map((entry) => entry.date),
    datasets: [
      {
        label: fundName || 'NAV',
        data: filteredData.map((entry) => parseFloat(entry.nav)),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.2,
        pointRadius: 0
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { maxTicksLimit: 8 }
      }
    }
  }

  return (
    <div className="nav-chart">
      <div className="range-buttons">
        {Object.keys(RANGES).map((key) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={key === range ? 'range-button active' : 'range-button'}
          >
            {key}
          </button>
        ))}
      </div>

      {filteredData.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>No data available for this range.</p>
      )}
    </div>
  )
}

export default NavChart