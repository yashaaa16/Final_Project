import express from 'express';
import supabase from '../supabaseclient.js';

const router = express.Router();

// CREATE stock record
router.post('/', async (req, res) => {
  const { product_id, warehouse_id, quantity } = req.body;
  const { data, error } = await supabase
    .from('stock')
    .insert([{ product_id, warehouse_id, quantity }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// READ all stock records
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('stock')
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ stock by product_id
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('stock')
    .select('*')
    .eq('product_id', req.params.product_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ stock by warehouse_id
router.get('/warehouse/:warehouse_id', async (req, res) => {
  const { data, error } = await supabase
    .from('stock')
    .select('*')
    .eq('warehouse_id', req.params.warehouse_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// UPDATE stock quantity
router.put('/:id', async (req, res) => {
  const { quantity } = req.body;
  const { data, error } = await supabase
    .from('stock')
    .update({ quantity })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Stock not found' });
  res.json(data);
});

// DELETE stock record
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('stock')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(404).json({ error: 'Stock not found' });
  res.json({ message: 'Stock deleted' });
});

export default router;