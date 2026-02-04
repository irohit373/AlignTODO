// Connection to Neon's serverless Postgres
import { neon } from '@neondatabase/serverless';

// Create the connection using the DATABASE_URL from .env
const sql = neon(process.env.DATABASE_URL);

// Simple query helper that returns { rows } to keep it compatible with existing code featrure of PostgrsSQL using Neon
export async function query(text, params) {
    const rows = await sql.query(text, params);
    return { rows };
}

export default sql;
