export function calculateCAGR(navHistory, investmentDate, investmentAmount) {
  if (!navHistory || navHistory.length === 0) return null

  const sorted = [...navHistory].sort((a, b) => parseDate(a.date) - parseDate(b.date))

  const targetDate = new Date(investmentDate)
  let startEntry = sorted.find((entry) => parseDate(entry.date) >= targetDate)

  if (!startEntry) {
    startEntry = sorted[sorted.length - 1]
  }

  const endEntry = sorted[sorted.length - 1]

  const startNav = parseFloat(startEntry.nav)
  const endNav = parseFloat(endEntry.nav)

  const startDate = parseDate(startEntry.date)
  const endDate = parseDate(endEntry.date)

  const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25)

  if (years <= 0) return null

  const units = investmentAmount / startNav
  const currentValue = units * endNav

  const cagr = (Math.pow(currentValue / investmentAmount, 1 / years) - 1) * 100

  return {
    startDate: startEntry.date,
    endDate: endEntry.date,
    startNav,
    endNav,
    investmentAmount,
    currentValue: Math.round(currentValue * 100) / 100,
    cagr: Math.round(cagr * 100) / 100,
    years: Math.round(years * 100) / 100
  }
}
export function calculateReturn(navHistory, days) {
  if (!navHistory || navHistory.length === 0) return null

  const sorted = [...navHistory].sort((a, b) => parseDate(a.date) - parseDate(b.date))
  const latest = sorted[sorted.length - 1]
  const latestDate = parseDate(latest.date)

  const cutoff = new Date(latestDate)
  cutoff.setDate(cutoff.getDate() - days)

  let startEntry = sorted.find((entry) => parseDate(entry.date) >= cutoff)
  if (!startEntry) startEntry = sorted[0]

  const startNav = parseFloat(startEntry.nav)
  const endNav = parseFloat(latest.nav)

  if (!startNav || startNav === 0) return null

  const returnPct = ((endNav - startNav) / startNav) * 100
  return Math.round(returnPct * 100) / 100
}
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('-')
  return new Date(`${year}-${month}-${day}`)
}