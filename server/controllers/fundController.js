import { searchFunds, getFundHistory } from '../utils/mfApiClient.js'

export async function search(req, res) {
  const { q } = req.query

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Search query is required' })
  }

  try {
    const results = await searchFunds(q)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch search results' })
  }
}

export async function getFundDetail(req, res) {
  const { schemeCode } = req.params

  try {
    const fund = await getFundHistory(schemeCode)

    if (fund.status !== 'SUCCESS') {
      return res.status(404).json({ error: 'Fund not found' })
    }

    res.json(fund)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fund details' })
  }
}

export async function compareFunds(req, res) {
  const { schemeCodes } = req.body

  if (!Array.isArray(schemeCodes) || schemeCodes.length < 2 || schemeCodes.length > 3) {
    return res.status(400).json({ error: 'Provide 2 to 3 scheme codes to compare' })
  }

  try {
    const funds = await Promise.all(schemeCodes.map((code) => getFundHistory(code)))
    res.json(funds)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comparison data' })
  }
}