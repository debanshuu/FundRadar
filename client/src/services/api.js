import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'
})

export async function searchFunds(query) {
  const res = await api.get('/funds/search', { params: { q: query } })
  return res.data
}

export async function getFundDetail(schemeCode) {
  const res = await api.get(`/funds/${schemeCode}`)
  return res.data
}

export async function compareFunds(schemeCodes) {
  const res = await api.post('/funds/compare', { schemeCodes })
  return res.data
}
export async function checkOverlap(schemeCodeA, schemeCodeB) {
  const res = await api.post('/overlap/check', { schemeCodeA, schemeCodeB })
  return res.data
}
export default api