import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, './../../.env') });

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// async function testConnection() {
//     try {
//         const client = await pool.connect();
//         console.log('Database connection established successfully.');
//         const data1 = await client.query('SELECT * from blocks limit 1');
//         console.log('Test query result from blocks:', data1.rows);
//         const data2 = await client.query('SELECT * from transactions limit 1');
//         console.log('Test query result from transactions:', data2.rows);
//         client.release();
//     } catch (err) {
//         console.error('Error connecting to the database:', err);
//     }
// }

// testConnection();