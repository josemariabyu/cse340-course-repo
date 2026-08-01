import db from '../config/db-connect.js';

// Todos los usuarios registrados (W05: página de users, solo admin)
export async function getAllUsers() {
  const sql = `
    SELECT user_id, name, email, role
    FROM users
    ORDER BY name ASC
  `;
  const result = await db.query(sql);
  return result.rows;
}

// Un usuario por su email (username) — usado en el login
export async function getUserByEmail(email) {
  const sql = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
  const result = await db.query(sql, [email]);
  return result.rows[0] || null;
}

// Un usuario por su ID
export async function getUserById(user_id) {
  const sql = 'SELECT user_id, name, email, role FROM users WHERE user_id = $1';
  const result = await db.query(sql, [user_id]);
  return result.rows[0] || null;
}

// Registro de un nuevo usuario (la contraseña llega YA hasheada)
export async function insertUser(name, email, password_hash, role = 'user') {
  const sql = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id, name, email, role
  `;
  const result = await db.query(sql, [name, email, password_hash, role]);
  return result.rows[0];
}
