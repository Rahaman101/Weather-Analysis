const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});

async function mail(sub, html, toMail) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL,
      to: toMail,
      subject: sub,
      html: html,
    });
    console.log("Message sent: %s", info);
  } catch (error) {
    console.log(error);
  }
}

module.exports = mail;
