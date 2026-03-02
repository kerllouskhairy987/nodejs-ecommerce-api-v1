const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure is false prot = 587 , if secure is true prot = 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Ecommerce Team" <montaserkergohar@gmail.com>', // sender address
    to: options.email, // list of recipients
    subject: options.subject, // subject line
    text: options.resetCode, // plain text body
    // html: `<b>${options.resetCode}</b>`, // HTML body
  });
};

module.exports = sendEmail;
