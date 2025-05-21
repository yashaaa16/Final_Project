import express from 'express';
import supabase from '../supabaseclient.js';
const router = express.Router();

// CREATE a new stock movement
router.post('/', async (req, res) => {
  const { 
    product_id, 
    quantity, 
    source_warehouse_id, 
    destination_warehouse_id,
    transfer_date,
    status,
    order_id
  } = req.body;
  
  const { data, error } = await supabase
    .from('stock_movements')
    .insert([{ 
      product_id, 
      quantity, 
      source_warehouse_id, 
      destination_warehouse_id,
      transfer_date,
      status,
      order_id
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// READ all stock movements
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*, products(name, sku), source_warehouse:warehouses!stock_movements_source_warehouse_id_fkey(name), destination_warehouse:warehouses!stock_movements_destination_warehouse_id_fkey(name), orders(id)')
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ stock movements by product ID
router.get('/product/:productId', async (req, res) => {
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*, products(name, sku), source_warehouse:warehouses!stock_movements_source_warehouse_id_fkey(name), destination_warehouse:warehouses!stock_movements_destination_warehouse_id_fkey(name), orders(id)')
    .eq('product_id', req.params.productId)
    .order('transfer_date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ stock movements by warehouse ID (as source or destination)
router.get('/warehouse/:warehouseId', async (req, res) => {
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*, products(name, sku), source_warehouse:warehouses!stock_movements_source_warehouse_id_fkey(name), destination_warehouse:warehouses!stock_movements_destination_warehouse_id_fkey(name), orders(id)')
    .or(`source_warehouse_id.eq.${req.params.warehouseId},destination_warehouse_id.eq.${req.params.warehouseId}`)
    .order('transfer_date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// READ a single stock movement by id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*, products(name, sku), source_warehouse:warehouses!stock_movements_source_warehouse_id_fkey(name), destination_warehouse:warehouses!stock_movements_destination_warehouse_id_fkey(name), orders(id)')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Stock movement not found' });
  res.json(data);
});

// UPDATE a stock movement by id
router.put('/:id', async (req, res) => {
  const { 
    product_id, 
    quantity, 
    source_warehouse_id, 
    destination_warehouse_id,
    transfer_date,
    status,
    order_id 
  } = req.body;
  
  const { data, error } = await supabase
    .from('stock_movements')
    .update({ 
      product_id, 
      quantity, 
      source_warehouse_id, 
      destination_warehouse_id,
      transfer_date,
      status,
      order_id
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Stock movement not found or could not be updated' });
  res.json(data);
});

// UPDATE status of a stock movement by id
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  
  const { data, error } = await supabase
    .from('stock_movements')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Stock movement not found' });
  res.json(data);
});

// DELETE a stock movement by id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('stock_movements')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(404).json({ error: 'Stock movement not found or could not be deleted' });
  res.json({ message: 'Stock movement deleted successfully' });
});

export default router;