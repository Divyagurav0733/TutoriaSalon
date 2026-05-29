const asyncHandler = require("express-async-handler");
const nodemailer   = require("nodemailer");

// @desc    Handle Contact Us form submission — emails the salon AND auto-replies to sender
// @route   POST /api/contact
// @access  Public
const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email, and message are required");
  }

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST  || "smtp.gmail.com",
    port:   parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // ── 1. Notify the salon ──────────────────────────────────────────────────
  const salonHtml = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:'Segoe UI',sans-serif;background:#efe9e7;padding:20px;margin:0">
      <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#52154e,#111344);padding:28px;text-align:center">
          <div style="color:#f9cff2;font-size:26px;letter-spacing:2px;font-weight:300">Tutoria</div>
          <p style="color:rgba(255,255,255,0.65);margin:8px 0 0;font-size:13px">New Contact Form Submission</p>
        </div>
        <div style="padding:28px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="border-bottom:1px solid #dae0f2">
              <td style="padding:10px 0;color:#888;font-size:12px;width:120px">FROM</td>
              <td style="padding:10px 0;font-weight:500;color:#111344">${name}</td>
            </tr>
            <tr style="border-bottom:1px solid #dae0f2">
              <td style="padding:10px 0;color:#888;font-size:12px">EMAIL</td>
              <td style="padding:10px 0;color:#111344"><a href="mailto:${email}" style="color:#52154e">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top:20px;background:#f5f3f8;border-left:3px solid #52154e;padding:16px;border-radius:0 8px 8px 0;font-size:14px;color:#444;line-height:1.7;white-space:pre-wrap">${message}</div>
          <p style="font-size:12px;color:#aaa;margin-top:20px">Reply directly to this email to respond to ${name}.</p>
        </div>
        <div style="background:#111344;color:rgba(255,255,255,0.5);text-align:center;padding:14px;font-size:12px">
          © 2026 Tutoria Salon | ${process.env.EMAIL_USER}
        </div>
      </div>
    </body>
    </html>
  `;

  // ── 2. Auto-reply to customer ────────────────────────────────────────────
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:'Segoe UI',sans-serif;background:#efe9e7;padding:20px;margin:0">
      <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#52154e,#111344);padding:32px;text-align:center">
          <div style="color:#f9cff2;font-size:28px;letter-spacing:2px;font-weight:300">Tutoria</div>
          <p style="color:rgba(255,255,255,0.65);margin:10px 0 0;font-size:13px">Thank you for reaching out ✦</p>
        </div>
        <div style="padding:32px">
          <p style="font-size:20px;color:#52154e;font-family:'Georgia',serif;margin-bottom:8px">Hello, ${name}!</p>
          <p style="font-size:14px;color:#555;line-height:1.8;margin-bottom:24px">
            We've received your message and our team will get back to you within <strong>24 hours</strong>.
            In the meantime, feel free to reach us directly:
          </p>
          <div style="background:#f5f3f8;border-radius:12px;padding:20px;font-size:13px;color:#444;line-height:2">
            📞 &nbsp;<strong>+91 98765 43210</strong><br/>
            ✉️ &nbsp;<a href="mailto:${process.env.EMAIL_USER}" style="color:#52154e">${process.env.EMAIL_USER}</a><br/>
            📍 &nbsp;Dukle Elite, St Inez Rd, Panjim, Goa
          </div>
          <div style="background:#fff5f5;border-left:3px solid #dae0f2;padding:14px 16px;border-radius:0 8px 8px 0;margin:24px 0;font-size:13px;color:#666;font-style:italic;line-height:1.6">
            Your message: "${message.length > 200 ? message.slice(0, 200) + "…" : message}"
          </div>
        </div>
        <div style="background:#111344;color:rgba(255,255,255,0.5);text-align:center;padding:14px;font-size:12px">
          © 2026 Tutoria Salon &nbsp;|&nbsp; +91 98765 43210
        </div>
      </div>
    </body>
    </html>
  `;

  const results = await Promise.allSettled([
    transporter.sendMail({
      from:    `"Tutoria Salon Contact" <${process.env.EMAIL_USER}>`,
      to:      process.env.SALON_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html:    salonHtml,
    }),
    transporter.sendMail({
      from:    `"Tutoria Salon" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: "We've received your message — Tutoria Salon",
      html:    customerHtml,
    }),
  ]);

  const failed = results.filter(r => r.status === "rejected");
  if (failed.length === 2) {
    console.error("Contact email errors:", failed.map(f => f.reason.message));
    res.status(502);
    throw new Error("Email service unavailable. Please call +91 98765 43210.");
  }
  if (failed.length === 1) {
    console.warn("One contact email failed:", failed[0].reason.message);
  }

  res.json({ success: true, message: "Message sent! We'll reply within 24 hours." });
});

module.exports = { sendContactMessage };
