import { Link } from 'react-router-dom'

function FundCard({ fund }) {
  return (
    <Link to={`/fund/${fund.schemeCode}`} className="fund-card">
      <div className="fund-card-name">{fund.schemeName}</div>
      <div className="fund-card-code">Scheme Code: {fund.schemeCode}</div>
    </Link>
  )
}

export default FundCard
