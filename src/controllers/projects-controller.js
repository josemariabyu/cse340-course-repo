import { validationResult } from 'express-validator';
import {
  getAllProjects as getAllProjectsModel,
  getProjectById,
  insertProject,
  updateProject,
  addVolunteer,
  removeVolunteer,
  isVolunteering
} from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

// Listado de proyectos
export async function getAllProjects(req, res, next) {
  try {
    const rows = await getAllProjectsModel();
    const projects = rows.map(p => ({
      project_id: p.project_id,
      name: p.title,
      date: p.date,
      organization_name: p.organization_name
    }));
    res.render('projects', { title: 'Upcoming Service Projects', projects });
  } catch (error) {
    next(error);
  }
}

// Detalle de proyecto
export async function getProjectDetails(req, res, next) {
  try {
    const projectId = req.params.id;
    if (isNaN(parseInt(projectId, 10))) {
      const err = new Error('Service project not found');
      err.status = 404;
      return next(err);
    }

    const rows = await getProjectById(projectId);
    const rawProject = rows.length > 0 ? rows[0] : null;
    if (!rawProject) {
      const err = new Error('Service project not found');
      err.status = 404;
      return next(err);
    }

    const project = {
      project_id: rawProject.project_id,
      title: rawProject.title,
      description: rawProject.description,
      location: rawProject.location,
      organization_name: rawProject.organization_name
    };

    const categories = await getCategoriesByProject(projectId);

    // W06: chequear si el usuario logueado ya es voluntario de este proyecto
    let isUserVolunteering = false;
    if (req.session && req.session.user) {
      isUserVolunteering = await isVolunteering(req.session.user.user_id, projectId);
    }

    res.render('project-detail', {
      title: project.title,
      project,
      categories: categories || [],
      isUserVolunteering
    });
  } catch (error) {
    next(error);
  }
}

// ---------- CREATE ----------
export async function newProjectForm(req, res, next) {
  try {
    const organizations = await getAllOrganizations();
    res.render('new-project', {
      title: 'New Service Project',
      errors: null,
      organizations,
      oldData: { title: '', description: '', location: '', organization_id: '' }
    });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const organizations = await getAllOrganizations();
      return res.status(400).render('new-project', {
        title: 'New Service Project',
        errors: errors.array(),
        organizations,
        oldData: req.body
      });
    }
    const { title, description, location, organization_id } = req.body;
    await insertProject(title, description, location, organization_id);
    res.redirect('/projects');
  } catch (error) {
    next(error);
  }
}

// ---------- EDIT ----------
export async function editProjectForm(req, res, next) {
  try {
    const rows = await getProjectById(req.params.id);
    const project = rows.length > 0 ? rows[0] : null;
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }
    const organizations = await getAllOrganizations();
    res.render('edit-project', {
      title: 'Edit Service Project',
      errors: null,
      project,
      organizations
    });
  } catch (error) {
    next(error);
  }
}

export async function editProject(req, res, next) {
  const errors = validationResult(req);
  const { title, description, location, organization_id } = req.body;
  try {
    if (!errors.isEmpty()) {
      const organizations = await getAllOrganizations();
      return res.status(400).render('edit-project', {
        title: 'Edit Service Project',
        errors: errors.array(),
        project: { project_id: req.params.id, title, description, location, organization_id },
        organizations
      });
    }
    await updateProject(req.params.id, title, description, location, organization_id);
    res.redirect('/projects');
  } catch (error) {
    next(error);
  }
}
// ---------- VOLUNTEER (W06) ----------
export async function volunteerForProject(req, res, next) {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await addVolunteer(userId, projectId);

    req.session.message = {
      type: 'success',
      text: 'You are now volunteering for this project!'
    };
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}

export async function unvolunteerFromProject(req, res, next) {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await removeVolunteer(userId, projectId);

    req.session.message = {
      type: 'success',
      text: 'You have removed yourself as a volunteer.'
    };

    // Si viene desde el dashboard, volver ahí; si no, volver al detalle del proyecto
    const redirectTo = req.body.redirectTo === 'dashboard' ? '/dashboard' : `/project/${projectId}`;
    res.redirect(redirectTo);
  } catch (error) {
    next(error);
  }
}