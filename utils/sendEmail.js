//パスワード発行再送メール
import nodemailer from 'nodemailer'

const sendEmail = async options => {

  const transporter = nodemailer.createTransport({
    //envファイルに移動
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  //メールの内容
  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
    
  }

  //messageを引き当て送信する
  await transporter.sendMail(message)

}

export default sendEmail