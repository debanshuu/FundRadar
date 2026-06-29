import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  const { fund1, fund2 } = req.body;
  res.json({ message: 'overlap route working' });
});

export default router;