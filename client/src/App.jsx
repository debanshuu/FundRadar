import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CompareProvider } from './context/CompareContext'
import Navbar from './components/Navbar'
import SearchPage from './pages/SearchPage'
import FundDetailPage from './pages/FundDetailPage'
import ComparePage from './pages/ComparePage'
import OverlapPage from './pages/OverlapPage'

function App() {
  return (
    <CompareProvider>
      <BrowserRouter>
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/fund/:schemeCode" element={<FundDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/overlap" element={<OverlapPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CompareProvider>
  )
}

export default App