import express from 'express';
import supabase from '../supabaseclient.js';
const router = express.Router();

// CREATE a new product
router.post('/', async (req, res) => {
  const { name, sku, category, supplier_id, cost_price, selling_price } = req.body;
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, sku, category, supplier_id, cost_price, selling_price }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// READ all products
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ a single product by id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Product not found' });
  res.json(data);
});

// UPDATE a product by id
router.put('/:id', async (req, res) => {
  const { name, sku, category, supplier_id, cost_price, selling_price } = req.body;
  const { data, error } = await supabase
    .from('products')
    .update({ name, sku, category, supplier_id, cost_price, selling_price })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Product not found' });
  res.json(data);
});

// DELETE a product by id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

export default router;