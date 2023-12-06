const nodemailer = require('nodemailer');
require('dotenv').config();
let creatT;
const mailer = async () => {
  creatT =  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: '20203tn078@utez.edu.mx',
      pass: 'iwhx fzej weuv cnpe'
    }
  });
  return creatT;
}
mailer().then((transport)=>{
  transport.verify().then(()=>{
    console.log("Ready to send emails");
  });
});

const sendMail = (destination,asunto, message) =>{
  try {
    creatT.sendMail({
        from: `"Devices system" <${process.env.EMAIL}>`,
        to: destination,
        subject: asunto,
        html: message,
        headers: {
          'Content-Type': 'text/html'
        }
    })
} catch (err) {
    console.log("Error")
}
}
//iwhx fzej weuv cnpe
module.exports = { mailer, sendMail };