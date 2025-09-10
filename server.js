const express = require('express');
const bodyParser = require('body-parser');
const { sql, connectDB } = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Add a new expense
app.post('/expenses', async (req, res) => {
    const { userId, description, amount, category } = req.body;

    if (!userId || !description || !amount) {
        return res.status(400).json({ message: 'userId, description, and amount are required' });
    }

    try {
        const pool = await connectDB();
        await pool.request()
            .input('UserId', sql.Int, userId)
            .input('Description', sql.NVarChar(255), description)
            .input('Amount', sql.Decimal(10,2), amount)
            .input('Category', sql.NVarChar(100), category)
            .query(`INSERT INTO Expenses (UserId, Description, Amount, Category) 
                    VALUES (@UserId, @Description, @Amount, @Category)`);
        res.status(201).json({ message: 'Expense added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// List all expenses
app.get('/expenses', async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM Expenses ORDER BY CreatedAt DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an expense by ID
app.delete('/expenses/:id', async (req, res) => {
    const expenseId = parseInt(req.params.id);
    if (isNaN(expenseId)) return res.status(400).json({ message: 'Invalid ID' });

    try {
        const pool = await connectDB();
        await pool.request()
            .input('ExpenseId', sql.Int, expenseId)
            .query('DELETE FROM Expenses WHERE Id = @ExpenseId');
        res.json({ message: `Expense with ID ${expenseId} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Budget Tracker API running on http://localhost:${PORT}`);
});
