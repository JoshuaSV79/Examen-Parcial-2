const express = require("express");
const cors = require("cors");
const app = express();

// Configuración CORS con IPs permitidas
const ALLOWED_ORIGINS = [
    'http://localhost:5500',
    'http://127.0.0.1:5500', 
    'http://10.13.122.232:5500', 
    'http://10.13.110.134:5500',
    'http://10.13.142.145:5500',
];

// Middlewares 
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const examsRoutes = require("./routes/exam.routes");
const certsRoutes = require("./routes/certs.routes");
const contactRoutes = require("./routes/contact.routes");

// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/exams", examsRoutes);
app.use("/api/certs", certsRoutes);
app.use("/api/contact", contactRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Endpoints disponibles:`);
  console.log(`POST /api/auth/login`);
  console.log(`POST /api/auth/logout`);
  console.log(`GET  /api/auth/profile`);
  console.log(`POST /api/exams/start`);
  console.log(`POST /api/exams/submit`);
  console.log(`GET  /api/certs/:id/pdf`);
  console.log(`POST /api/contact/submit`);
});