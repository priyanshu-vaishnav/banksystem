require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"BankSystem" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegisterEmail(to, token) {
  const subject = 'Registration Confirmation';
  const text = `Your registration token is: ${token}`;
  const html = `<p>Your registration token is: <strong>${token}</strong></p>`;
  await sendEmail(to, subject, text, html);
}

async function sendLoginEmail(to, token) {
  const subject = 'Security Alert: Successful Login to Your BankSystem Account';

  const text = `
Hello,

We detected a successful login to your BankSystem account.

If this was you, no further action is required.

If you do NOT recognize this login, please reset your password immediately:
https://yourdomain.com/secure-account/${token}

Regards,
BankSystem Security Team
  `;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;
            border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #1a73e8;">Login Confirmation</h2>
  <p>We detected a successful login to your <strong>BankSystem</strong> account.</p>
  <p style="font-size: 14px; color: #555;">
    For your protection, never share your password or verification codes with anyone.
  </p>
  <hr style="margin: 20px 0;" />
  <p style="font-size: 12px; color: #888;">
    © ${new Date().getFullYear()} BankSystem. All rights reserved.
  </p>
</div>
  `;

  await sendEmail(to, subject, text, html);
}

// balance should be the ALREADY UPDATED balance (after deduction)
async function sendTransactionMail(to, amount, balance) {
  const subject = 'Transaction Completed!';
  const text = `₹${amount} has been debited. Remaining balance: ₹${balance}`;

  const html = `
<div style="font-family: Arial; max-width: 600px;">
  <h3>Transaction Successful</h3>
  <p>₹${amount} has been successfully debited from your account.</p>
  <p>Your remaining balance is <strong>₹${balance}</strong>.</p>
  <hr/>
  <p style="font-size: 12px; color: #888;">
    If you did not authorize this transaction, contact support immediately.
  </p>
</div>
  `;

  await sendEmail(to, subject, text, html);
}

async function sendToTransactionMail(to, amount) {
  const subject = 'Amount Credited!';
  const text = `₹${amount} has been credited to your account.`;

  const html = `
<div style="font-family: Arial; max-width: 600px;">
  <h3>Amount Credited!</h3>
  <p>₹${amount} has been credited to your account.</p>
  <hr/>
  <p style="font-size: 12px; color: #888;">
    If you did not expect this transfer, contact support immediately.
  </p>
</div>
  `;

  await sendEmail(to, subject, text, html);
}

module.exports = {
  sendRegisterEmail,
  sendLoginEmail,
  sendTransactionMail,
  sendToTransactionMail,
};