import axios from 'axios'

const BASE_URL = 'https://api.mfapi.in/mf'

export async function searchFunds(query) {
  const res = await axios.get(`${BASE_URL}/search`, { params: { q: query } })
  return res.data
}

export async function getFundHistory(schemeCode) {
  const res = await axios.get(`${BASE_URL}/${schemeCode}`)
  return res.data
}

export async function getFundLatestNav(schemeCode) {
  const res = await axios.get(`${BASE_URL}/${schemeCode}/latest`)
  return res.data
}