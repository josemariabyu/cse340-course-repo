import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Detecta de forma 100% segura si estás en internet (Render) o en tu computadora
// process.env.RENDER es una variable automática que Render crea en sus servidores
const isProduction = process.env.RENDER || process.env.NODE_ENV === 'production';

const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  // Si estás en Render activa SSL, si estás en tu computadora local no lo usa
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

export default db;


