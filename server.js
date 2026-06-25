const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseURL = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseURL, supabaseServiceKey);

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Define Routes
// * GET
app.get('/user/:student_id', async (req, res) => {
    try {

        const { student_id } = req.params;

        const { data, error } = await supabase.from('users').select('*').eq('student_id', student_id).single();

        if (error) throw error;

        res.status(200).json({ message: 'User Found!', data });

    } catch (error) {
        console.error('Error: ', error.message);
        res.status(404).json({ error: 'User not found or something wrong.' })
    }
})

// * POST
app.post('/register', async (req, res) => {
    try {
        const {
            student_id, first_name, last_name,
            faculty, department, major, phone_number, email, birth_date
        } = req.body;

        const { data, error } = await supabase.from('users').insert([
            {
                student_id, first_name, last_name,
                faculty, department, major, phone_number, email, birth_date
            }
        ]);

        if (error) throw error;

        res.status(200).json({ message: 'Registeration Success.', data });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server starting ... on Port ${PORT}`);
});