import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'

function Navbar() {
  const { basket } = useCompare()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">MutualFundIQ</Link>
      <div className="navbar-links">
        <Link to="/overlap" className="navbar-link">Overlap</Link>
        <Link to="/compare" className="navbar-compare">
          Compare
          {basket.length > 0 && <span className="compare-badge">{basket.length}</span>}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar