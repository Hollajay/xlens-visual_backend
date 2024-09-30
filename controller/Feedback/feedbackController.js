const feedbackModel = require('../../Models/feedBackModel')
const sendMail = require('../../Utils/mail');


const feedbackController  = async (req, res) => {
  const { fullname, email, message } = req.body;

  try {
    if (!fullname || !email || !message) {
      return res.status(400).json('All fields must be filled'); 
      
    }

    const newMessage = await feedbackModel.create({ fullname, email, message });

    // Email options for notifying yourself
    const notifyOptions = {
      from: process.env.EMAIL,
      subject: `New Message from ${fullname}`,
      email_to: process.env.EMAIL,
      body_message: `
        <p>Hello,</p>
        <p>You have received a new message from the contact form:</p>
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <p>Please review and respond to the inquiry as soon as possible.</p>
        <p>Best regards,<br/>Your Website Team</p>
      `
    };
    

    // Email options for confirming to the user
    const confirmOptions = {
      from: process.env.EMAIL,
      subject: 'Thank You for Your Message',
      email_to: email,
      body_message: `
        <p>Dear ${fullname},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        <p>We appreciate your interest and look forward to assisting you.</p>
        <p>Best regards,<br/>The Xlens visualization Team</p>
      `
    };
    

    // Send notification email to yourself
    await sendMail(notifyOptions);

    // Send confirmation email to the user
    await sendMail(confirmOptions);

    // Respond to the user
    return res.status(201).json('Message sent and email sent');
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json(error.message);
    } else {
      console.error("Headers already sent, unable to send error response.");
    }
  }
};


module.exports = feedbackController
