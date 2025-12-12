import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

export async function sendMail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      to,
      subject,
      text,
      html
    });
    return info;
  } catch (e) {
    console.warn('Mailer error:', e);
    throw e;
  }
}

export { transporter };
