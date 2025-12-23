import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const notificationTemplates = {
  OTP_SENT: ( otp ) => ({
    subject: `New OTP`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background:#f5f6fa; font-family:Arial, sans-serif;">
        <table width="100%" style="padding:20px 0; background:#f5f6fa;">
          <tr>
            <td align="center">
              <table width="600" style="background:#fff; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="background:#2563eb; color:#fff; padding:20px; font-size:20px; font-weight:bold;">
                    OTP : ${otp}
                  </td>
                </tr>

                

              </table>
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