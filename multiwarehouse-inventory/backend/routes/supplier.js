import express from 'express';
import supabase from '../supabaseclient.js';
const router = express.Router();

// CREATE a new supplier
router.post('/', async (req, res) => {
  const { company_name, contact_info } = req.body;
  
  const { data, error } = await supabase
    .from('suppliers')
    .insert([{ company_name, contact_info }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// READ all suppliers
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*, products(*)')
    .order('company_name', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ a single supplier by id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*, products(*)')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Supplier not found' });
  res.json(data);
});

// READ products by supplier id
router.get('/:id/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('supplier_id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// UPDATE a supplier by id
router.put('/:id', async (req, res) => {
  const { company_name, contact_info } = req.body;
  
  const { data, error } = await supabase
    .from('suppliers')
    .update({ company_name, contact_info })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Supplier not found' });
  res.json(data);
});

// DELETE a supplier by id
router.delete('/:id', async (req, res) => {
  // First check if supplier has any products
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('supplier_id', req.params.id);
  
  if (products && products.length > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete supplier with associated products. Please reassign or delete the products first.' 
    });
  }

  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(404).json({ error: 'Supplier not found or could not be deleted' });
  res.json({ message: 'Supplier deleted successfully' });
});

export default router;