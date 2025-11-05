const QUESTIONS = require("../data/questions");
const users = require("../data/users");

// Almacenar intentos de examen en memoria
const examAttempts = new Map();

const startExam = (req, res) => {
  const user = req.user;

  // Verificar si ya pagó (esto puede venir del localStorage del frontend)
  // Para este ejemplo, usamos la bandera pagado del usuario
  /*if (!user.pagado) {
    return res.status(403).json({
      error: "Debes pagar el examen antes de aplicarlo"
    });
  }*/

  // Verificar si ya aplicó el examen EN ESTA SESIÓN
  // Buscar si existe algún intento activo o completado para este usuario
  let existingAttempt = null;
  for (let [attemptId, attempt] of examAttempts) {
    if (attempt.userId === user.cuenta) {
      existingAttempt = attempt;
      break;
    }
  }

  if (existingAttempt && existingAttempt.completed) {
    return res.status(403).json({
      error: "El examen solo se puede aplicar una vez por sesión. Cierra sesión e inicia nuevamente para otro intento."
    });
  }

  if (existingAttempt && !existingAttempt.completed) {
    return res.status(403).json({
      error: "Ya tienes un examen en progreso"
    });
  }

  // Seleccionar 8 preguntas aleatorias NO repetidas
  const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 8).map(q => ({
    id: q.id,
    text: q.text,
    options: [...q.options].sort(() => 0.5 - Math.random()) // Mezclar opciones
  }));

  // Crear intento de examen
  const attemptId = require('crypto').randomUUID();
  const attempt = {
    id: attemptId,
    userId: user.cuenta,
    questions: selectedQuestions,
    startedAt: new Date(),
    completed: false,
    passed: false,
    score: 0
  };

  examAttempts.set(attemptId, attempt);

  res.status(200).json({
    message: "Examen generado exitosamente",
    attemptId: attemptId,
    questions: selectedQuestions
  });
};

const submitExam = (req, res) => {
  const user = req.user;
  const { attemptId, answers } = req.body;

  // Validar intento
  const attempt = examAttempts.get(attemptId);
  if (!attempt || attempt.userId !== user.cuenta) {
    return res.status(404).json({
      error: "Intento de examen no encontrado"
    });
  }

  if (attempt.completed) {
    return res.status(400).json({
      error: "Este examen ya fue calificado"
    });
  }

  // Calificar respuestas
  let score = 0;
  const details = [];

  attempt.questions.forEach(question => {
    const userAnswer = answers.find(a => a.questionId === question.id);
    const originalQuestion = QUESTIONS.find(q => q.id === question.id);
    
    const isCorrect = userAnswer && userAnswer.answer === originalQuestion.correct;
    if (isCorrect) score++;

    details.push({
      questionId: question.id,
      text: question.text,
      yourAnswer: userAnswer ? userAnswer.answer : null,
      correctAnswer: originalQuestion.correct,
      correct: isCorrect
    });
  });

  // Determinar si aprobó (6/8 = 75%)
  const passed = score >= 6;
  
  // Actualizar intento - SOLO marcar como completado, NO modificar usuario permanentemente
  attempt.completed = true;
  attempt.score = score;
  attempt.passed = passed;
  attempt.submittedAt = new Date();
  attempt.details = details;

  // IMPORTANTE: NO modificamos el usuario permanentemente
  // Esto permite que al hacer logout y login nuevamente, pueda intentar otra vez


  res.status(200).json({
    message: "Examen calificado",
    score: score,
    total: 8,
    passed: passed,
    details: details
  });
};

module.exports = { startExam, submitExam, examAttempts };