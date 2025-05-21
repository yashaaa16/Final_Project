import express from 'express';
import supabase from '../supabaseclient.js';
const router = express.Router();

// CREATE a new warehouse
router.post('/', async (req, res) => {
  const { name, location, capacity } = req.body;
  
  const { data, error } = await supabase
    .from('warehouses')
    .insert([{ name, location, capacity }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// READ all warehouses
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ a single warehouse by id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Warehouse not found' });
  res.json(data);
});

// READ stock movements for a warehouse (as source or destination)
router.get('/:id/stock-movements', async (req, res) => {
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*, products(name, sku), source_warehouse:warehouses!stock_movements_source_warehouse_id_fkey(name), destination_warehouse:warehouses!stock_movements_destination_warehouse_id_fkey(name)')
    .or(`source_warehouse_id.eq.${req.params.id},destination_warehouse_id.eq.${req.params.id}`)
    .order('transfer_date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET warehouse inventory (this would require additional logic/tables in a real system)
router.get('/:id/inventory', async (req, res) => {
  // This is a complex query that calculates inventory based on stock movements
  // In a real system, you might have a separate inventory table or materialized view
  
  // First, get all incoming movements to this warehouse
  const { data: incomingData, error: incomingError } = await supabase.rpc('get_warehouse_inventory', { 
    warehouse_id: req.params.id 
  });

  if (incomingError) {
    return res.status(500).json({ 
      error: incomingError.message,
      message: 'To use this endpoint, you need to create an RPC function in Supabase called "get_warehouse_inventory"'
    });
  }

  res.json(incomingData || []);
});

// UPDATE a warehouse by id
router.put('/:id', async (req, res) => {
  const { name, location, capacity } = req.body;
  
  const { data, error } = await supabase
    .from('warehouses')
    .update({ name, location, capacity })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Warehouse not found' });
  res.json(data);
});

// DELETE a warehouse by id
router.delete('/:id', async (req, res) => {
  // First check if warehouse is used in any stock movements
  const { data: movements } = await supabase
    .from('stock_movements')
    .select('id')
    .or(`source_warehouse_id.eq.${req.params.id},destination_warehouse_id.eq.${req.params.id}`)
    .limit(1);
  
  if (movements && movements.length > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete warehouse that has associated stock movements' 
    });
  }

  const { error } = await supabase
    .from('warehouses')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(404).json({ error: 'Warehouse not found or could not be deleted' });
  res.json({ message: 'Warehouse deleted successfully' });
});

export default router;