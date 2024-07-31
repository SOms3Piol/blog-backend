import nodemailer from "nodemailer";
export default async function sendMail(email, token, status) {
  try {
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "fb7be51f5eee8d",
        pass: "9e8d286304331c"
      }
    });

    await transport.sendMail({
      from: "maddison53@ethereal.email", // sender address
      to: email, // list of receivers
      subject:
        status == "verify" ? "Verification of the Account" : "Forget Password", // Subject line
      text: "Hello world?", // plain text body
      html: `<a href ='${process.env.FRONTEND_DOMAIN}/verify?token=${token}'>${token}</a>`, // html body
    });
  } catch (error) {
    console.log("Email Failed To send:  ", error);
  }
}
