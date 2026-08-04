const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, tool_type, description } = req.body || {};

  if (!name || !email || !tool_type || !description) {
    return res.status(400).json({ error: 'name, email, tool_type, description required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

  const allowedTypes = ['tool', 'automation', 'n8n_workflow', 'agent', 'other'];
  if (!allowedTypes.includes(tool_type)) {
    return res.status(400).json({ error: 'invalid tool_type' });
  }

  const { data, error } = await supabase
    .from('tool_requests')
    .insert([{ name, email, tool_type, description }])
    .select('id')
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'failed to save request' });
  }

  return res.status(200).json({ success: true, id: data.id });
};
