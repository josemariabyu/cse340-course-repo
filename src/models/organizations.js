import db from '../config/db-connect.js';

export async function getAllOrganizations() {
  const sql = 'SELECT * FROM organizations ORDER BY name ASC';
  const result = await db.query(sql);
  return result.rows;
}

export async function getOrganizationById(organization_id) {
  const sql = 'SELECT * FROM organizations WHERE organization_id = $1';
  const result = await db.query(sql, [organization_id]);
  return result.rows;
}

export async function insertOrganization(name) {
  const sql = 'INSERT INTO organizations (name) VALUES ($1) RETURNING *';
  const result = await db.query(sql, [name]);
  return result.rows[0];
}

export async function updateOrganization(organization_id, name) {
  const sql = 'UPDATE organizations SET name = $1 WHERE organization_id = $2 RETURNING *';
  const result = await db.query(sql, [name, organization_id]);
  return result.rows[0];
}

