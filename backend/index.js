// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Supabase client (using service role for full access)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/upload — save simulation
app.post('/api/upload', async (req, res) => {
  const { subject, chapter, htmlContent } = req.body;

  const validSubjects = ['Physics', 'Maths', 'Chemistry', 'Biology'];
  if (!validSubjects.includes(subject)) {
    return res.status(400).json({ error: 'Invalid subject' });
  }
  if (!chapter || !htmlContent) {
    return res.status(400).json({ error: 'Missing chapter or HTML content' });
  }

  try {
    const { data, error } = await supabase
      .from('simulations')
      .insert({ subject, chapter, html_content: htmlContent })
      .select('id')
      .single();

    if (error) throw error;

    // Generate public URL
    const publicUrl = `https://simulations-qd01.onrender.com/sim/${data.id}`;
    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save simulation' });
  }
});

// GET /sim/:id — serve HTML content
app.get('/sim/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('simulations')
      .select('html_content')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).send('<h1>Simulation not found</h1>');
    }

    // Set correct content type and send HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(data.html_content);
  } catch (err) {
    res.status(500).send('<h1>Server Error</h1>');
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});