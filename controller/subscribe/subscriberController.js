
const Subscribe = require("../../Models/subscribeModel");

const sendMail = require("../../Utils/mail");



const getAllSubscriber = async (req,res) => {
    try {
        const subscribe = await Subscribe.find()
        return res.status(200).json(subscribe)
    } catch (error) {
        return res.status(500).json("there is and fechting the subscriber ", error.message)
    }
}

const CreateSubscriber = async (req,res) => {

    const { email } = req.body


 try {
      if(!email){
        console.log(email)
        return res.status(400).json('email input  must be filled'); 
      }
   const newSubscriber = await Subscribe.create({email});

   const notifyOptions = {
    from: process.env.EMAIL,
    subject: 'New Subscriber Alert!',
    email_to: process.env.EMAIL,
    body_message: `
      <p>Hello,</p>
      <p>You have received a new subscriber:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>Kindly add this email to your subscription list.</p>
      <p>Best regards,<br/>Your Subscription System</p>
    `
  };
  
   const confirmOptions = {
    from: process.env.EMAIL,
    subject: 'Subscription Confirmed - Welcome!',
    email_to: email,
    body_message: `
      <p>Dear Subscriber,</p>
      <p>Thank you for joining our community! We're thrilled to have you with us. You can expect to receive regular updates, exclusive content, and the latest news directly in your inbox.</p>
      <p>If you have any questions or need assistance, feel free to reach out to us at any time.</p>
      <p>We look forward to staying connected!</p>
      <p>Best regards,<br/>The [Xlens visualization] Team</p>
    `
  };
  

  // Send notification email to yourself
  await sendMail(notifyOptions);

  // Send confirmation email to the user
  await sendMail(confirmOptions);

  // Respond to the user
  return res.status(201).json(' email sent');
} catch (error) {
  if (!res.headersSent) {
    return res.status(500).json(error.message);
  } else {
    console.error("Headers already sent, unable to send error response.");
  }
}

}
module.exports = {
    getAllSubscriber,
    CreateSubscriber
}