import express from 'express'
import { search, getFundDetail, compareFunds } from '../controllers/fundController.js'

const router = express.Router()

router.get('/search', search)
router.get('/:schemeCode', getFundDetail)
router.post('/compare', compareFunds)

export default router