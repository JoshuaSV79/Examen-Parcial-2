const sessions = new Map();
const users = require("../data/users");
const {examAttempts} = require('../controllers/exams.controller');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Token no proporcionado o formato incorrecto'
    });
  }

  const token = authHeader.substring(7);
  const userId = sessions.get(token);

  if (!userId) {
    return res.status(401).json({ 
      error: 'Token inválido o expirado' 
    });
  }

  // Buscar usuario completo
  const user = users.find(u => u.cuenta === userId);
  if (!user) {
    return res.status(401).json({ 
      error: 'Usuario no encontrado' 
    });
  }

  req.user = user;
  req.token = token;
  next();
};

exports.createSession = (userId) => {
  const crypto = require('crypto');
  const token = crypto.randomUUID();
  sessions.set(token, userId);
  return token;
};

exports.deleteSession = (token) => {
  const userId = sessions.get(token);
  if(userId){
    for(let [attemptId,attempt] of examAttempts){
      if(attempt.userId === userId){
        examAttempts.delete(attemptId);
      }
    }
  }
  return sessions.delete(token);
};