import { newsletterValidationSchema } from "@/types/schemas";
import axios from "axios";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: Request) {
  const { email, subject, message } = await request.json();

  // Server side validation
  const validatedFields = newsletterValidationSchema.safeParse({
    email: email,
    subject: subject,
    message: message,
  });
  if (!validatedFields.success) {
    return Response.json(
      {
        message: "validation error",
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      },
      { status: 200 }
    );
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    /* 
      setting service as 'gmail' is same as providing these setings:
      host: "smtp.gmail.com",
      port: 465,
      secure: true
      If you want to use a different email provider other than gmail, you need to provide these manually.
      Or you can go use these well known services and their settings at
      https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
  */
    auth: {
      user: process.env.NEXT_PUBLIC_GOOGLE_MY_EMAIL,
      pass: process.env.GOOGLE_PASSWORD_APP,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.NEXT_PUBLIC_GOOGLE_MY_EMAIL,
    to: process.env.NEXT_PUBLIC_GOOGLE_MY_EMAIL,
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `Message from (${email}) about ${subject}`,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err: any) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    const values = {
      email: email,
      subject: subject,
      message: message,
    };

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/api/public/newsletters",
      values
    );

    const data = response.data;
    if (data.success === true) {
      await sendMailPromise();
      return Response.json({ message: data.message }, { status: 200 });
    } else {
      return Response.json({ message: data.message }, { status: 200 });
    }
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}
