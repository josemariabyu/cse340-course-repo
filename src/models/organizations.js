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

export async function insertOrganization(name, description, email) {
  const sql = `
    INSERT INTO organizations (name, description, email)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await db.query(sql, [name, description, email]);
  return result.rows[0];
}

export async function updateOrganization(organization_id, name, description, email, image_url) {
  const sql = `
    UPDATE organizations
    SET name = $1, description = $2, email = $3, image_url = $4
    WHERE organization_id = $5
    RETURNING *
  `;
  const result = await db.query(sql, [name, description, email, image_url, organization_id]);
  return result.rows[0];
}
