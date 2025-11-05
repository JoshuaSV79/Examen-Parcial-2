const users = require("../data/users");
const { createSession, deleteSession } = require("../middleware/auth.middleware");

exports.login = (req, res) => {
  const { cuenta, contrasena } = req.body;

  if (!cuenta || !contrasena) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: 'cuenta' y 'contrasena'"
    });
  }

  const user = users.find(u => u.cuenta === cuenta && u.contrasena === contrasena);

  if (!user) {
    return res.status(401).json({ 
      error: "Credenciales inválidas" 
    });
  }

  user.examenAplicado = false;

  const token = createSession(user.cuenta);
  
  console.log(`[LOGIN] Usuario: ${user.cuenta} | Token: ${token}`);

  res.status(200).json({
    mensaje: "Acceso permitido",
    usuario: { 
      cuenta: user.cuenta,
      nombreCompleto: user.nombreCompleto,
      pagado: user.pagado,
      examenAplicado: user.examenAplicado
    },
    token: token
  });
};

exports.logout = (req, res) => {
  const token = req.token;
  const userId = req.user.cuenta;

  console.log(`[LOGOUT] Usuario: ${userId}`);

  const deleted = deleteSession(token);

  if (deleted) {
    res.status(200).json({ 
      mensaje: "Sesión cerrada correctamente" 
    });
  } else {
    res.status(404).json({ 
      error: "Sesión no encontrada" 
    });
  }
};

exports.getProfile = (req, res) => {
  res.status(200).json({
    usuario: { 
      cuenta: req.user.cuenta,
      nombreCompleto: req.user.nombreCompleto,
      email: req.user.email,
      pagado: req.user.pagado,
      examenAplicado: req.user.examenAplicado
    }
  });
};