function ComparisonTable({ rows, funds }) {
  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Metric</th>
          {funds.map((fund) => (
            <th key={fund.meta.scheme_code}>{fund.meta.scheme_name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const values = funds.map((fund) => row.getValue(fund))
          const best = row.higherIsBetter ? Math.max(...values) : Math.min(...values)

          return (
            <tr key={row.label}>
              <td className="metric-label">{row.label}</td>
              {funds.map((fund, i) => (
                <td key={fund.meta.scheme_code} className={values[i] === best ? 'winner-cell' : ''}>
                  {row.format ? row.format(values[i]) : values[i]}
                  {values[i] === best && <span className="winner-badge">Best</span>}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ComparisonTable