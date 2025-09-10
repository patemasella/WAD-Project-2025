const { sql, connectDB } = require('./db');

async function addExpense(userId, description, amount, category) {
    const pool = await connectDB();
    await pool.request()
        .input('UserId', sql.Int, userId)
        .input('Description', sql.NVarChar(255), description)
        .input('Amount', sql.Decimal(10,2), amount)
        .input('Category', sql.NVarChar(100), category)
        .query(`INSERT INTO Expenses (UserId, Description, Amount, Category) 
                VALUES (@UserId, @Description, @Amount, @Category)`);
    console.log('Expense added successfully!');
}

async function listExpenses() {
    const pool = await connectDB();
    const result = await pool.request()
        .query('SELECT * FROM Expenses ORDER BY CreatedAt DESC');
    console.table(result.recordset);
}

async function deleteExpense(expenseId) {
    const pool = await connectDB();
    await pool.request()
        .input('ExpenseId', sql.Int, expenseId)
        .query('DELETE FROM Expenses WHERE Id = @ExpenseId');
    console.log(`Expense with ID ${expenseId} deleted.`);
}

// Example usage
(async () => {
    await addExpense(1, 'Coffee', 4.50, 'Food');
    await listExpenses();
    await deleteExpense(2);
})();
