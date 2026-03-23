import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

const OWNER_EMAIL = 'christianmanuel1233@gmail.com';
const FROM_ADDRESS = process.env.EMAIL_FROM || 'CodeByNas <onboarding@resend.dev>';

// ─── Email: notificación al dueño ─────────────────────────────────────────────

function buildOwnerEmail(name, email, subject, message) {
  const now = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const field = (label, value, isLink = false) => `
    <tr>
      <td style="padding:0 0 16px 0;">
        <p style="margin:0 0 6px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;color:#737373;text-transform:uppercase;letter-spacing:0.15em;">${label}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr>
            <td style="background-color:#141414;border-left:2px solid #A855F7;border-radius:0 6px 6px 0;padding:12px 16px;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#ffffff;line-height:1.6;word-break:break-word;">${isLink ? `<a href="mailto:${value}" style="color:#C084FC;text-decoration:none;">${value}</a>` : value}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Nuevo mensaje de contacto</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#050505;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table width="520" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:520px;width:100%;background-color:#0A0A0A;border-radius:8px;border:1px solid #1a1a1a;overflow:hidden;">

          <!-- Top accent line -->
          <tr>
            <td style="background-color:#A855F7;height:2px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #1a1a1a;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Code<span style="color:#A855F7;">By</span>Nas</p>
              <p style="margin:6px 0 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#525252;letter-spacing:0.1em;text-transform:uppercase;">Portfolio &mdash; Nuevo mensaje</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 8px;">
              <p style="margin:0 0 28px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.3px;">Nuevo mensaje recibido</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                ${field('Nombre', name)}
                ${field('Correo', email, true)}
                ${field('Asunto', subject)}
              </table>

              <!-- Message block -->
              <p style="margin:0 0 8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;color:#737373;text-transform:uppercase;letter-spacing:0.15em;">Mensaje</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="background-color:#141414;border-left:2px solid #A855F7;border-radius:0 6px 6px 0;padding:16px 20px;">
                    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#d4d4d4;line-height:1.75;white-space:pre-wrap;word-break:break-word;">${message}</p>
                  </td>
                </tr>
              </table>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:28px;">
                <tr>
                  <td>
                    <a href="mailto:${email}?subject=Re%3A%20${encodeURIComponent(subject)}" style="display:inline-block;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;background-color:#A855F7;border-radius:6px;padding:10px 22px;letter-spacing:0.01em;">Responder a ${name}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1a1a1a;margin-top:32px;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#525252;line-height:1.6;">Recibido desde portafolio web &mdash; ${now}</p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Email: confirmación al usuario ──────────────────────────────────────────

function buildConfirmationEmail(name, email, subject) {
  const now = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const field = (label, value, isLink = false) => `
    <tr>
      <td style="padding:0 0 16px 0;">
        <p style="margin:0 0 6px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;color:#737373;text-transform:uppercase;letter-spacing:0.15em;">${label}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr>
            <td style="background-color:#141414;border-left:2px solid #A855F7;border-radius:0 6px 6px 0;padding:12px 16px;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#ffffff;line-height:1.6;word-break:break-word;">${isLink ? `<a href="mailto:${value}" style="color:#C084FC;text-decoration:none;">${value}</a>` : value}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Mensaje recibido</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#050505;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table width="520" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:520px;width:100%;background-color:#0A0A0A;border-radius:8px;border:1px solid #1a1a1a;overflow:hidden;">

          <!-- Top accent line -->
          <tr>
            <td style="background-color:#A855F7;height:2px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #1a1a1a;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Code<span style="color:#A855F7;">By</span>Nas</p>
              <p style="margin:6px 0 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#525252;letter-spacing:0.1em;text-transform:uppercase;">christian estrada &mdash; portfolio</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0 0 8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.4px;">Mensaje recibido</p>
              <p style="margin:0 0 28px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#a3a3a3;line-height:1.65;">Gracias por contactarme, ${name}. Te responderé pronto.</p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                ${field('Nombre', name)}
                ${field('Correo', email, true)}
                ${field('Asunto', subject)}
              </table>

              <p style="margin:28px 0 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#525252;line-height:1.6;">Si no enviaste este mensaje puedes ignorar este correo.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1a1a1a;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td>
                    <a href="https://github.com/ChristianEMV" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#A855F7;text-decoration:none;margin-right:16px;">GitHub</a>
                    <a href="https://www.linkedin.com/in/christian-estrada-mvz/" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#A855F7;text-decoration:none;margin-right:16px;">LinkedIn</a>
                    <a href="https://twitter.com/ChrisEMV" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#A855F7;text-decoration:none;">Twitter / X</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px;">
                    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#525252;line-height:1.6;">Recibido desde portafolio web &mdash; ${now}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px;">
                    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#525252;">&copy; 2025 Christian Estrada</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Endpoint ─────────────────────────────────────────────────────────────────

app.post('/api/sendEmail', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos',
    });
  }

  try {
    // 1) Notificación al dueño
    const ownerResult = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [OWNER_EMAIL],
      reply_to: email,
      subject: `[Portfolio] ${subject} — de ${name}`,
      html: buildOwnerEmail(name, email, subject, message),
    });

    // 2) Confirmación al usuario
    const confirmResult = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: 'He recibido tu mensaje — CodeByNas',
      html: buildConfirmationEmail(name, email, subject),
    });

    console.log(`✅ Notificación enviada al dueño | id: ${ownerResult?.data?.id}`);
    console.log(`✅ Confirmación enviada a ${email} | id: ${confirmResult?.data?.id}`);

    res.status(200).json({
      success: true,
      message: 'Mensaje enviado correctamente',
      ownerEmailId: ownerResult?.data?.id,
      confirmEmailId: confirmResult?.data?.id,
    });
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje',
      error: error.message,
    });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend del portafolio de Christian Estrada',
    status: 'activo',
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor en http://localhost:${PORT}`);
  console.log(`📧 Endpoint: http://localhost:${PORT}/api/sendEmail\n`);
});
