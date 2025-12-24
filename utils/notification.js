import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const notificationTemplates = {
  OTP_SENT: ( otp ) => ({
    subject: `New OTP`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background:#f5f6fa; font-family:Arial, sans-serif;">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.08); padding:30px;">

          <!-- Logo / Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; color:#2563eb;">Account Verification</h1>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="color:#333; font-size:16px; line-height:1.6;">
              <p>Hello,</p>

              <p>
                To continue, please use the One-Time Password (OTP) below to verify your request.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  padding:16px 32px;
                  font-size:26px;
                  font-weight:bold;
                  letter-spacing:6px;
                  color:#ffffff;
                  background:linear-gradient(135deg, #2563eb, #1e40af);
                  border-radius:8px;
                ">
                  ${otp}
                </span>
              </div>

              <p>
                This OTP is valid for a limited time.  
                Please do not share this code with anyone for security reasons.
              </p>

              <p>
                If you did not request this, you can safely ignore this email.
              </p>

              <p style="margin-top:30px;">
                Regards,<br />
                <strong>Support Team, Veggies</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:25px; font-size:12px; color:#888;">
              © 2025 Veggies. All rights reserved.
            </td>
          </tr>

        </table>
      </body>
      </html>
    `
  })
};

// const msg = {
//   to: 'harshitchauhan939@gmail.com',
//   from: 'harshit.chauhan2015@gmail.com', // Use the email address or domain you verified above
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };

// (async () => {
//   try {
//     console.log('Sending test email via SendGrid...');
//     await sgMail.send(msg);
//   } catch (error) {
//     console.error(error);

//     if (error.response) {
//       console.error(error.response.body)
//     }
//   }
// })();

export const sendNotification = async ({ email, type, payload }) => {
    console.log('sendNotification called with:', { email, type, payload });
  const template = notificationTemplates[type];

  if (!template) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  const { subject, html } = template(payload);
  const msg = {
    to: email,
  from: 'harshit.chauhan2015@gmail.com', // Use the email address or domain you verified above
  subject: subject,
  text: 'twilio',
  html: html,
  }
  console.log('Sending test email via SendGrid...');
    await sgMail.send(msg);
  console.log('Sending notification:', {
    
    email,
    type,
    payload
  });
  return { success: true };
};