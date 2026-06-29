import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function loadHoldings() {
  const filePath = path.join(__dirname, '../data/holdingsData.json')
  const raw = await readFile(filePath, 'utf-8')
  return JSON.parse(raw)
}

export async function getOverlap(req, res) {
  const { schemeCodeA, schemeCodeB } = req.body

  if (!schemeCodeA || !schemeCodeB) {
    return res.status(400).json({ error: 'Provide two scheme codes to check overlap' })
  }

  try {
    const holdingsData = await loadHoldings()

    const fundA = holdingsData[schemeCodeA]
    const fundB = holdingsData[schemeCodeB]

    if (!fundA || !fundB) {
      return res.status(404).json({
        error: 'Holdings data not available for one or both funds. This feature currently covers a curated list of large-cap funds only.'
      })
    }

    const stocksA = new Map(fundA.holdings.map((h) => [h.stock, h.weight]))
    const stocksB = new Map(fundB.holdings.map((h) => [h.stock, h.weight]))

    const overlappingStocks = []
    let overlapWeight = 0

    for (const [stock, weightA] of stocksA) {
      if (stocksB.has(stock)) {
        const weightB = stocksB.get(stock)
        overlappingStocks.push({ stock, weightA, weightB })
        overlapWeight += Math.min(weightA, weightB)
      }
    }

    const overlapPercent = Math.round(overlapWeight * 100) / 100

    res.json({
      fundA: { schemeCode: schemeCodeA, schemeName: fundA.schemeName },
      fundB: { schemeCode: schemeCodeB, schemeName: fundB.schemeName },
      overlappingStocks,
      overlapPercent
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate overlap' })
  }
}