const { sql, connectDB } = require('./db');
const readline = require('readline-sync');

async function addExpense() {
    const userId = parseInt(readline.question('Enter User ID: '));
    const description = readline.question('Enter Description: ');
    const amount = parseFloat(readline.question('Enter Amount: '));
    const category = readline.question('Enter Category (optional): ');

    const pool = await connectDB();
    await pool.request()
        .input('UserId', sql.Int, userId)
        .input('Description', sql.NVarChar(255), description)
        .input('Amount', sql.Decimal(10, 2), amount)
        .input('Category', sql.NVarChar(100), category)
        .query(`INSERT INTO Expenses (UserId, Description, Amount, Category)
                VALUES (@UserId, @Description, @Amount, @Category)`);

    console.log('Expense added successfully!');
}

async function listExpenses() {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Expenses ORDER BY CreatedAt DESC');
    console.table(result.recordset);
}

async function deleteExpense() {
    const expenseId = parseInt(readline.question('Enter Expense ID to delete: '));
    const pool = await connectDB();
    await pool.request()
        .input('ExpenseId', sql.Int, expenseId)
        .query('DELETE FROM Expenses WHERE Id = @ExpenseId');
    console.log(`Expense with ID ${expenseId} deleted.`);
}

async function addUser() {
    const username = readline.question('Enter username: ');
    const email = readline.question('Enter email: ');
    const password = readline.question('Enter password: ', { hideEchoBack: true }); // hides input

    const pool = await connectDB();
    await pool.request()
        .input('Username', sql.NVarChar(100), username)
        .input('Email', sql.NVarChar(255), email)
        .input('Password', sql.NVarChar(255), password)
        .query(`INSERT INTO Users (Username, Email, Password) VALUES (@Username, @Email, @Password)`);

    console.log('✅ User added successfully!');
}



async function listUsers() {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT id, Username, Email, CreatedAt FROM Users ORDER BY id ASC');
    console.table(result.recordset);
}

async function main() {
    while (true) {
        console.log('\n--- Budget Tracker ---');
        console.log('1. Add Expense');
        console.log('2. List Expenses');
        console.log('3. Delete Expense');
        console.log('4. Add User');
        console.log('5. List Users');
        console.log('6. Exit');

        const choice = readline.question('Choose an option: ');

        if (choice === '1') await addExpense();
        else if (choice === '2') await listExpenses();
        else if (choice === '3') await deleteExpense();
        else if (choice === '4') await addUser();
        else if (choice === '5') await listUsers();
        else if (choice === '6') break;
        else console.log('⚠️ Invalid choice, try again.');
    }

    console.log('Goodbye!');
    process.exit(0);
}

main();
