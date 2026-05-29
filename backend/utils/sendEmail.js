const nodemailer = require("nodemailer");

//  Transporter factory 
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // TLS via STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // allow self-signed certs in dev
    },
  });
};

//  Shared HTML shell 
const wrapHtml = (headerText, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #efe9e7; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #52154e, #111344); padding: 32px; text-align: center; }
    .logo { color: #f9cff2; font-size: 28px; font-weight: 300; letter-spacing: 4px; margin-bottom: 4px; }
    .header-sub { color: rgba(255,255,255,0.65); font-size: 13px; margin: 0; }
    .body { padding: 32px; }
    .greeting { font-size: 22px; color: #52154e; margin: 0 0 8px; }
    .intro { color: #666; font-size: 14px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #eee; }
    .row:last-of-type { border-bottom: none; }
    .label { color: #999; font-size: 13px; }
    .value { font-weight: 600; font-size: 13px; color: #111344; text-align: right; max-width: 60%; }
    .price-block { font-size: 30px; color: #52154e; font-weight: 700; text-align: center; margin: 24px 0 8px; }
    .price-note { text-align: center; color: #aaa; font-size: 12px; margin-bottom: 24px; }
    .message-box { background: #fff8f0; border-left: 4px solid #52154e; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 13px; color: #444; line-height: 1.7; }
    .note { font-size: 12px; color: #aaa; text-align: center; margin-top: 24px; line-height: 1.6; }
    .footer { background: #111344; color: rgba(255,255,255,0.55); text-align: center; padding: 16px 24px; font-size: 12px; line-height: 1.8; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-cancelled { background: #fdecea; color: #c62828; }
    .badge-updated  { background: #e8f5e9; color: #2e7d32; }
    .badge-confirm  { background: #e8eaf6; color: #283593; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Tutoria</div>
      <p class="header-sub">${headerText}</p>
    </div>
    <div class="body">
      ${bodyContent}
    </div>
    <div class="footer">
      © 2026 Tutoria Salon, Pune &nbsp;·&nbsp; +91 98765 43210 &nbsp;·&nbsp; hello@tutoriasalon.in<br/>
      <span style="font-size:11px;opacity:0.6">This is an automated message — please do not reply directly to this email.</span>
    </div>
  </div>
</body>
</html>`;

//  1. Booking Confirmation 
const sendBookingConfirmation = async ({
  to,
  customerName,
  bookingId,
  serviceName,
  stylistName,
  date,
  timeSlot,
  price,
  payment,
}) => {
  const transporter = createTransporter();

  const body = `
    <p class="greeting">Hello, ${customerName}! 🎉</p>
    <p class="intro">Your appointment is confirmed. See you soon at Tutoria Salon!</p>

    <div class="row"><span class="label">Booking ID</span><span class="value">#${bookingId}</span></div>
    <div class="row"><span class="label">Service</span><span class="value">${serviceName}</span></div>
    <div class="row"><span class="label">Stylist</span><span class="value">${stylistName}</span></div>
    <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
    <div class="row"><span class="label">Time</span><span class="value">${timeSlot}</span></div>
    <div class="row"><span class="label">Payment Mode</span><span class="value">${payment}</span></div>

    <div class="price-block">₹${price}</div>
    <p class="price-note">Amount to be paid</p>

    <p class="note">Need to reschedule or cancel? Please do so at least 24 hours before your appointment via our website or by calling us.</p>
  `;

  await transporter.sendMail({
    from: `"Tutoria Salon" <${process.env.EMAIL_USER}>`,
    to,
    subject: `✦ Booking Confirmed — ${serviceName} on ${date}`,
    html: wrapHtml("Appointment Confirmed ", body),
  });
};

//  2. Admin Cancellation Email 
const sendCancellationEmail = async ({
  to,
  customerName,
  bookingId,
  serviceName,
  stylistName,
  date,
  timeSlot,
  message,
  cancelledBy = "admin",
}) => {
  const transporter = createTransporter();

  const introText = cancelledBy === "customer"
    ? "Your appointment has been <strong>cancelled</strong> as requested."
    : "We regret to inform you that your appointment has been <strong>cancelled</strong> by our team.";

  const noteLabel = cancelledBy === "customer" ? "Cancellation note:" : "Note from our team:";
  const defaultMsg = cancelledBy === "customer"
    ? "We hope to see you again soon! Feel free to book a new appointment anytime."
    : "We apologise for any inconvenience caused. Please book a new appointment at your convenience.";

  const body = `
    <p class="greeting">Hello, ${customerName}</p>
    <p class="intro">${introText}</p>

    <div class="row"><span class="label">Booking ID</span><span class="value">#${bookingId}</span></div>
    <div class="row"><span class="label">Service</span><span class="value">${serviceName}</span></div>
    ${stylistName ? `<div class="row"><span class="label">Stylist</span><span class="value">${stylistName}</span></div>` : ""}
    <div class="row"><span class="label">Date &amp; Time</span><span class="value">${date} at ${timeSlot}</span></div>
    <div class="row"><span class="label">Status</span><span class="value"><span class="badge badge-cancelled">Cancelled</span></span></div>

    <div class="message-box">
      <strong>${noteLabel}</strong><br/>
      ${message || defaultMsg}
    </div>

    <p class="note">To rebook or for any queries, please visit our website or call us at +91 98765 43210.</p>
  `;

  await transporter.sendMail({
    from: `"Tutoria Salon" <${process.env.EMAIL_USER}>`,
    to,
    subject: cancelledBy === "customer"
      ? `Your Cancellation Confirmation — #${bookingId}`
      : `Booking Cancelled — #${bookingId}`,
    html: wrapHtml("Appointment Cancelled", body),
  });
};

//  3. Admin Edit/Reschedule Email 
const sendEditEmail = async ({
  to,
  customerName,
  bookingId,
  serviceName,
  oldDate,
  oldTimeSlot,
  newDate,
  newTimeSlot,
  newStatus,
  stylistName,
  adminNote,
}) => {
  const transporter = createTransporter();

  // Build a human-readable summary of what changed
  const changes = [];
  if (newDate && newDate !== oldDate)
    changes.push(`<div class="row"><span class="label">New Date</span><span class="value">${newDate}</span></div>`);
  if (newTimeSlot && newTimeSlot !== oldTimeSlot)
    changes.push(`<div class="row"><span class="label">New Time</span><span class="value">${newTimeSlot}</span></div>`);
  if (stylistName)
    changes.push(`<div class="row"><span class="label">New Stylist</span><span class="value">${stylistName}</span></div>`);
  if (newStatus)
    changes.push(`<div class="row"><span class="label">Status</span><span class="value"><span class="badge badge-updated">${newStatus}</span></span></div>`);

  const body = `
    <p class="greeting">Hello, ${customerName}</p>
    <p class="intro">Your appointment has been <strong>updated</strong> by our team. Here's a summary of the changes:</p>

    <div class="row"><span class="label">Booking ID</span><span class="value">#${bookingId}</span></div>
    <div class="row"><span class="label">Service</span><span class="value">${serviceName}</span></div>
    <div class="row"><span class="label">Previous Date</span><span class="value">${oldDate} at ${oldTimeSlot}</span></div>

    ${changes.join("")}

    ${
      adminNote
        ? `<div class="message-box"><strong>Note from our team:</strong><br/>${adminNote}</div>`
        : ""
    }

    <p class="note">If you have any questions about these changes, please call us at +91 98765 43210 or visit our website.</p>
  `;

  await transporter.sendMail({
    from: `"Tutoria Salon" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Updated — #${bookingId}`,
    html: wrapHtml("Appointment Updated ", body),
  });
};

//  4. Custom Admin Notification 
const sendCustomEmail = async ({ to, customerName, subject, message }) => {
  const transporter = createTransporter();

  const body = `
    <p class="greeting">Hello, ${customerName}</p>
    <div class="message-box">${message}</div>
    <p class="note">For any queries, contact us at +91 98765 43210 or hello@tutoriasalon.in</p>
  `;

  await transporter.sendMail({
    from: `"Tutoria Salon" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || "Message from Tutoria Salon",
    html: wrapHtml("Message from Tutoria Salon", body),
  });
};

//  Verify transporter on startup (optional helper) 
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log(" Email transporter ready");
  } catch (err) {
    console.warn("  Email config issue:", err.message);
    console.warn("   Set EMAIL_USER and EMAIL_PASS in your .env file");
  }
};

module.exports = {
  sendBookingConfirmation,
  sendCancellationEmail,
  sendEditEmail,
  sendCustomEmail,
  verifyEmailConfig,
};
