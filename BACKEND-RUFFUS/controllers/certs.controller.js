const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { examAttempts } = require('./exams.controller');

const generateCertificate = (req, res) => {
  const user = req.user;
  const { attemptId } = req.params;

  const attempt = examAttempts.get(attemptId);
  if (!attempt || attempt.userId !== user.cuenta) {
    return res.status(404).json({ error: "Intento de examen no encontrado" });
  }

  if (!attempt.passed) {
    return res.status(403).json({ error: "No aprobaste el examen para generar certificado" });
  }

  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    layout: 'landscape'
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=certificado-${user.cuenta}.pdf`);
  doc.pipe(res);

  // Colores institucionales
  const primaryColor = '#1a73e8';
  const secondaryColor = '#34a853';
  const textColor = '#333333';
  const centerX = doc.page.width / 2;

  // Fondo y marco
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');
  doc.strokeColor(primaryColor).lineWidth(3)
     .roundedRect(30, 30, doc.page.width - 60, doc.page.height - 60, 10).stroke();

  // Logo institucional
  const logoPath = path.join(__dirname, '../assets/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 50 });
    doc.fillColor(primaryColor).fontSize(18).font('Helvetica-Bold')
       .text('RUFFUS CERTIFY', 110, 60);
  } else {
    doc.fillColor(primaryColor).fontSize(20).font('Helvetica-Bold')
       .text('RUFFUS CERTIFY', 50, 50);
  }

  // Título principal
  doc.fillColor(primaryColor).fontSize(30).font('Helvetica-Bold')
     .text('CERTIFICADO DE APROBACIÓN', 0, 120, { align: 'center' });

  // Texto introductorio
  doc.fillColor(textColor).fontSize(16).font('Helvetica')
     .text('Se otorga el presente certificado a:', 0, 160, { align: 'center' });

  doc.fillColor(primaryColor).fontSize(26).font('Helvetica-Bold')
     .text(user.nombreCompleto.toUpperCase(), 0, 195, { align: 'center' });

  doc.fillColor(textColor).fontSize(14).font('Helvetica')
     .text('Por haber aprobado satisfactoriamente el examen de:', 0, 230, { align: 'center' });

  doc.fillColor(secondaryColor).fontSize(20).font('Helvetica-Bold')
     .text('Fundamentos de Desarrollo Web y Programación', 0, 260, { align: 'center' });

  doc.fillColor(textColor).fontSize(14).font('Helvetica')
     .text(`Con una calificación de ${attempt.score}/8 puntos (${Math.round((attempt.score / 8) * 100)}%)`, 0, 290, { align: 'center' });

  // Información adicional
  const infoY = 320;
  doc.fillColor('#666666').fontSize(12).font('Helvetica')
     .text(`Fecha del examen: ${attempt.submittedAt.toLocaleDateString('es-MX')}`, 0, infoY, { align: 'center' })
     .text(`ID del certificado: CERT-${attemptId.slice(0, 8).toUpperCase()}`, { align: 'center' })
     .text(`Ciudad: Aguascalientes, Ags.`, { align: 'center' });

  // Firmas con imágenes
  const signaturesY = 400;
  const signatureWidth = 150;
  const signatureHeight = 50;

  const firma1Path = path.join(__dirname, '../assets/firma1.png');
  const firma2Path = path.join(__dirname, '../assets/firma2.png');

  // Firma izquierda
  if (fs.existsSync(firma1Path)) {
    doc.image(firma1Path, 80, signaturesY - signatureHeight, { width: signatureWidth });
  }
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#333')
     .text('Lic. Carlos Ruiz', 80, signaturesY + 10, { width: signatureWidth, align: 'center' })
     .fontSize(9).font('Helvetica')
     .text('Instructor Certificado', 80, signaturesY + 25, { width: signatureWidth, align: 'center' });

  // Firma derecha
  const rightX = doc.page.width - 80 - signatureWidth;
  if (fs.existsSync(firma2Path)) {
    doc.image(firma2Path, rightX, signaturesY - signatureHeight, { width: signatureWidth });
  }
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#333')
     .text('Dra. Georgina Salazar', rightX, signaturesY + 10, { width: signatureWidth, align: 'center' })
     .fontSize(9).font('Helvetica')
     .text('Directora General', rightX, signaturesY + 25, { width: signatureWidth, align: 'center' });
  doc.end();
};

module.exports = { generateCertificate };