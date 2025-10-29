import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar el transporter de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar la conexión con el servidor de correo
transporter.verify((error, success) => {
  if (error) {
    console.error('Error al configurar el servidor de correo:', error);
  } else {
    console.log('✅ Servidor de correo listo para enviar mensajes');
  }
});

// Ruta para enviar emails
app.post('/api/sendEmail', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validar campos
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos',
    });
  }

  // Configurar el email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'christianmanuel1233@gmail.com',
    subject: 'Nuevo mensaje desde tu portafolio web',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #D056F1 0%, #8200A5 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .field {
            margin-bottom: 20px;
          }
          .field-label {
            font-weight: bold;
            color: #9616B8;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .field-value {
            color: #333;
            font-size: 16px;
            line-height: 1.6;
            padding: 12px;
            background-color: #f5f5f5;
            border-radius: 8px;
          }
          .message-box {
            background-color: #f5f5f5;
            border-left: 4px solid #D056F1;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Nuevo Mensaje de Contacto</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Nombre</div>
              <div class="field-value">${name}</div>
            </div>
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value"><a href="mailto:${email}" style="color: #D056F1; text-decoration: none;">${email}</a></div>
            </div>
            <div class="field">
              <div class="field-label">Asunto</div>
              <div class="field-value">${subject}</div>
            </div>
            <div class="field">
              <div class="field-label">Mensaje</div>
              <div class="message-box">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>Este mensaje fue enviado desde tu portafolio web</p>
            <p>© 2025 Christian Estrada</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    // Enviar el email
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Mensaje enviado de ${name} (${email})`);
    
    res.status(200).json({
      success: true,
      message: 'Mensaje enviado correctamente',
    });
  } catch (error) {
    console.error('❌ Error al enviar el email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje',
      error: error.message,
    });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend del portafolio de Christian Estrada',
    status: 'activo',
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📧 Endpoint de email: http://localhost:${PORT}/api/sendEmail\n`);
});

