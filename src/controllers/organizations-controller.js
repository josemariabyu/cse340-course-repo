import { getProjectsByOrganization } from '../models/projects.js';
import {
  getAllOrganizations,
  getOrganizationById,
  insertOrganization,
  updateOrganization
} from '../models/organizations.js';

// Listado de organizaciones
export async function getOrganizationsList(req, res, next) {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', {
      title: 'Organizations',
      organizations: organizations || []
    });
  } catch (error) {
    next(error);
  }
}
// Detalle de organización (W03)
export async function getOrganizationDetails(req, res, next) {
  try {
    const organizationId = req.params.id;
    if (isNaN(parseInt(organizationId, 10))) {
      const err = new Error('Organization not found');
      err.status = 404;
      return next(err);
    }

    const rows = await getOrganizationById(organizationId);
    const organization = rows.length > 0 ? rows[0] : null;
    if (!organization) {
      const err = new Error('Organization not found');
      err.status = 404;
      return next(err);
    }

    const rawProjects = await getProjectsByOrganization(organizationId);
    const projects = rawProjects.map(p => ({
      project_id: p.project_id,
      name: p.title,
      date: p.date
    }));

    res.render('organization-detail', { title: organization.name, organization, projects });
  } catch (error) {
    next(error);
  }
}

// ---------- CREATE ----------
export function newOrganizationForm(req, res) {
  res.render('new-organization', {
    title: 'New Organization',
    errors: null,
    oldData: { name: '' }
  });
}

export async function createOrganization(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('new-organization', {
      title: 'New Organization',
      errors: errors.array(),
      oldData: req.body
    });
  }
  try {
    await insertOrganization(req.body.name);
    res.redirect('/organizations');
  } catch (error) {
    next(error);
  }
}

// ---------- EDIT ----------
export async function editOrganizationForm(req, res, next) {
  try {
    const rows = await getOrganizationById(req.params.id);
    const organization = rows.length > 0 ? rows[0] : null;
    if (!organization) {
      const err = new Error('Organization not found');
      err.status = 404;
      return next(err);
    }
    res.render('edit-organization', {
      title: 'Edit Organization',
      errors: null,
      organization
    });
  } catch (error) {
    next(error);
  }
}

export async function editOrganization(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('edit-organization', {
      title: 'Edit Organization',
      errors: errors.array(),
      organization: { organization_id: req.params.id, name: req.body.name }
    });
  }
  try {
    await updateOrganization(req.params.id, req.body.name);
    res.redirect('/organizations');
  } catch (error) {
    next(error);
  }
}
