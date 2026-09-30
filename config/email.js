// Import nodemailer, the library that sends emails from our server
const nodemailer = require("nodemailer");

// Create a reusable "transporter" — this represents our connection
// to the email-sending service (Ethereal, in our case)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,   // the mail server address, from .env
  port: process.env.EMAIL_PORT,   // the port that server listens on, from .env
  auth: {
    user: process.env.EMAIL_USER, // our Ethereal username, from .env
    pass: process.env.EMAIL_PASS, // our Ethereal password, from .env
  },
});

// This function sends a confirmation email after someone registers for an event
// It takes the recipient's email and the event details as arguments
const sendConfirmationEmail = async (toEmail, eventTitle, eventDate) => {
  try {
    // .sendMail() actually sends the email, and returns info about the send
    const info = await transporter.sendMail({
      from: '"Event Management System" <noreply@eventapp.com>', // sender name/address shown
      to: toEmail,                                                // who receives it
      subject: `Registration Confirmed: ${eventTitle}`,           // email subject line
      text: `You have successfully registered for "${eventTitle}" on ${eventDate}. See you there!`,
      // a simple plain-text body for now — we can make this fancier HTML later
    });

    // Ethereal gives us a special preview URL so we can view the "sent" email in a browser
    console.log("Email sent! Preview URL:", nodemailer.getTestMessageUrl(info));

  } catch (error) {
    // If sending fails, log it — but we deliberately don't crash the whole
    // registration process just because an email failed to send
    console.error("Email sending failed:", error.message);
  }
};

// Make this function available to our controller
module.exports = sendConfirmationEmail;