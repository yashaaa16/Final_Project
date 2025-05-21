import express from 'express';
import supabase from '../supabaseclient.js';

const router = express.Router();

// CREATE supplier record
router.post('/', async (req, res) => {
  const { company_name, contact_info } = req.body;
  
  // Validate required fields
  if (!company_name) {
    return res.status(400).json({ error: 'Company name is required' });
  }
  
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
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ supplier by id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Supplier not found' });
  res.json(data);
});

// UPDATE supplier
router.put('/:id', async (req, res) => {
  const { company_name, contact_info } = req.body;
  const updates = {};
  
  // Only update fields that are provided
  if (company_name !== undefined) updates.company_name = company_name;
  if (contact_info !== undefined) updates.contact_info = contact_info;
  
  // Check if there are any updates to make
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No update data provided' });
  }

  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Supplier not found or update failed' });
  res.json(data);
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(404).json({ error: 'Supplier not found or deletion failed' });
  res.json({ message: 'Supplier deleted successfully' });
});

export default router;