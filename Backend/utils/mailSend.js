import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodeMailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth:{
        user: process.env.gmailAccount,
        pass: process.env.appPassword
    },
})

const mailOptions = {
    from: "PetslikeService@gmail.com",
    to: "",
    subject: "This is the verification code sent by Pet's Like",
    text:""
}

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });