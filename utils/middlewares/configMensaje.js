const nodemailer = require("nodemailer");
const MAIL_PASS = process.env.MAIL_PASS;

const createTrans = () => {
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'psychogoodapp@gmail.com', // generated ethereal user
      pass: MAIL_PASS, // generated ethereal password
    }
  });

  return transporter
}


const sendMail = async (emailInfo) => {
const transporter = createTrans()
let info = await transporter.sendMail({
    ...emailInfo
  });

  console.log("Mensaje enviado: %s", info.messageId);

  return
}

exports.sendMail = (emailInfo) => sendMail(emailInfo)