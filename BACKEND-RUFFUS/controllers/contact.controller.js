const contactMessages = [];

const submitContact = (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios"
    });
  }

  // Guardar mensaje
  const message = {
    id: contactMessages.length + 1,
    nombre,
    email,
    mensaje,
    fecha: new Date().toISOString()
  };

  contactMessages.push(message);

  // Imprimir en consola del servidor
  console.log('=== NUEVO MENSAJE DE CONTACTO ===');
  console.log(`Nombre: ${nombre}`);
  console.log(`Email: ${email}`);
  console.log(`Mensaje: ${mensaje}`);
  console.log(`Fecha: ${message.fecha}`);
  console.log('================================');

  res.status(200).json({
    message: "Mensaje enviado correctamente"
  });
};

const getContactMessages = (req, res) => {
  res.json(contactMessages);
};

module.exports = { submitContact, getContactMessages };