#!/usr/bin/env node
require('dotenv').config();
const { Command } = require('commander');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const program = new Command();
program.name('mfacli').description('Musfiraai tool-request CLI').version('1.0.0');

program
  .command('list')
  .description('List tool requests')
  .option('-s, --status <status>', 'filter by status: pending|in_progress|done|rejected', 'pending')
  .action(async (opts) => {
    const { data, error } = await supabase
      .from('tool_requests')
      .select('*')
      .eq('status', opts.status)
      .order('created_at', { ascending: false });
    if (error) return console.error('Error:', error.message);
    if (!data.length) return console.log(`No "${opts.status}" requests.`);
    data.forEach((r) => {
      console.log(`\n[${r.id}]`);
      console.log(`  Name: ${r.name}`);
      console.log(`  Email: ${r.email}`);
      console.log(`  Type: ${r.tool_type}`);
      console.log(`  Desc: ${r.description}`);
      console.log(`  Created: ${r.created_at}`);
    });
  });

program
  .command('view <id>')
  .description('View full details of one request')
  .action(async (id) => {
    const { data, error } = await supabase.from('tool_requests').select('*').eq('id', id).single();
    if (error) return console.error('Error:', error.message);
    console.log(data);
  });

program
  .command('status <id> <newStatus>')
  .description('Update request status: pending|in_progress|done|rejected')
  .action(async (id, newStatus) => {
    const allowed = ['pending', 'in_progress', 'done', 'rejected'];
    if (!allowed.includes(newStatus)) {
      return console.error(`Status must be one of: ${allowed.join(', ')}`);
    }
    const { error } = await supabase
      .from('tool_requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return console.error('Error:', error.message);
    console.log(`Request ${id} -> ${newStatus}`);
  });

program
  .command('stats')
  .description('Show counts per status')
  .action(async () => {
    const statuses = ['pending', 'in_progress', 'done', 'rejected'];
    for (const s of statuses) {
      const { count, error } = await supabase
        .from('tool_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', s);
      if (error) return console.error('Error:', error.message);
      console.log(`${s}: ${count}`);
    }
  });

program.parse(process.argv);
