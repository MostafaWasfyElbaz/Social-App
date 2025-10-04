import nodemailer from "nodemailer";

export const sendEmail = async (email: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const main = async () => {
        await transporter.sendMail({
          from: `Social App <${process.env.EMAIL_USER}>`,
          to: email,
          subject: subject,
          html: html,
        });
      };
      main().catch((err) => {
        console.log("Error sending email: ", err);
      });
}