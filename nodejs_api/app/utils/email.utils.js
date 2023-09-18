import pkg from 'nodemailer';

const { nodemailer } = pkg;

/**
 * Sends an email using nodemailer.
 *
 * @param {Object} options - The options for sending the email.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.message - The body of the email.
 * @return {Promise<void>} - A promise that resolves when the email is sent successfully.
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOption = {
    from: 'Developer <contact@katapi.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOption);
};
export default sendEmail;
