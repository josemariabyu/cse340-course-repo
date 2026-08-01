// W05: middleware de autenticación y autorización

// Exige que el usuario esté logueado
export function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.session.message = {
    type: 'error',
    text: 'You must log in to access that page.'
  };
  return res.redirect('/login');
}

// Exige que el usuario tenga un rol determinado (ej: 'admin')
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.session.message = {
        type: 'error',
        text: 'You must log in to access that page.'
      };
      return res.redirect('/login');
    }

    if (req.session.user.role !== role) {
      req.session.message = {
        type: 'error',
        text: 'You do not have permission to access that page.'
      };
      return res.redirect('/dashboard');
    }

    return next();
  };
}

// Deja el usuario y los mensajes disponibles en TODAS las vistas
export function setLocals(req, res, next) {
  res.locals.user = (req.session && req.session.user) || null;
  res.locals.isAdmin = !!(req.session && req.session.user && req.session.user.role === 'admin');
  res.locals.message = (req.session && req.session.message) || null;
  if (req.session) delete req.session.message;
  next();
}
