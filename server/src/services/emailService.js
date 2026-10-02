import nodemailer from 'nodemailer';

function createTransporter() {
  // 1. Gmail with App Password
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASS ? process.env.GMAIL_APP_PASS.replace(/\s+/g, '') : null;

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  // 2. Custom SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return null;
}

let _transporter = createTransporter();

async function getTransporter() {
  if (_transporter) return _transporter;

  try {
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📬 Ethereal test account initialized:', testAccount.user);
    return _transporter;
  } catch (err) {
    console.warn('Could not create Ethereal account, falling back to mock mailer:', err.message);
    return null;
  }
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(toEmail, userName, otp) {
  console.log(`\n=================================================`);
  console.log(`🔑 OTP GENERATED FOR ${toEmail}: [ ${otp} ]`);
  console.log(`=================================================\n`);

  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.log('ℹ️ Transporter not available. Using console-logged OTP.');
      return;
    }

    const fromName = 'Skill Swap';
    const fromEmail = process.env.GMAIL_USER || 'no-reply@skillswap.app';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: `${otp} is your Skill Swap verification code`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#FAF9F8;font-family:'Segoe UI',Inter,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;border:1px solid #E5E7EB;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#FF5A4A 0%,#E94A3B 100%);padding:32px 40px;text-align:center;">
              <div style="font-size:24px;font-weight:800;color:#fff;">🔄 skill swap</div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h1 style="font-size:22px;color:#111827;">Verify your email address</h1>
              <p style="font-size:14px;color:#6B7280;">Hi ${userName || 'there'}, your verification code is:</p>
              <div style="background:#FFF1EE;border:2px dashed #FF5A4A;border-radius:16px;padding:24px;text-align:center;margin:20px 0;">
                <div style="font-size:38px;font-weight:800;color:#111827;letter-spacing:0.15em;">${otp}</div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 OTP Email preview URL: ${previewUrl}`);
    } else {
      console.log(`📧 OTP Email sent successfully to ${toEmail}`);
    }
  } catch (err) {
    console.error('⚠️ Could not send OTP email via SMTP:', err.message);
    console.log(`🔑 Use console logged OTP [ ${otp} ] to verify.`);
  }
}
