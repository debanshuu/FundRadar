import { createContext, useContext, useState } from 'react'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [basket, setBasket] = useState([])

  function addToCompare(fund) {
    setBasket((prev) => {
      if (prev.some((f) => f.schemeCode === fund.schemeCode)) return prev
      if (prev.length >= 3) return prev
      return [...prev, fund]
    })
  }

  function removeFromCompare(schemeCode) {
    setBasket((prev) => prev.filter((f) => f.schemeCode !== schemeCode))
  }

  function clearCompare() {
    setBasket([])
  }

  return (
    <CompareContext.Provider value={{ basket, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) throw new Error('useCompare must be used within a CompareProvider')
  return context
}