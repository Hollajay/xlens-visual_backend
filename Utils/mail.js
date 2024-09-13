const nodemailer = require('nodemailer');

const sendMail = async ({ from, subject, email_to, body_message }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSKEY,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const options = {
    from: from,
    to: email_to,
    replyTo: from,
    subject: subject,
    html: body_message
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        console.log(info);
        return resolve(info);
      }
    });
  });
};

module.exports = sendMail;
