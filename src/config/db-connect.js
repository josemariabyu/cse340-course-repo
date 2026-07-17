import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Detectamos si estamos en local (localhost) o en Render (producción)
const isProduction = process.env.NODE_ENV === 'production' || process.env.DB_HOST.includes('render') || process.env.DB_HOST.includes('neon');

const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  // Si estamos en producción (Render) activa SSL, si estamos en tu computadora lo desactiva solo
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

export default db;

