require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

// ✅ Serve frontend dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Email config pakai Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Endpoint POST untuk form kontak
app.post("/contact", async (req, res) => {
  const { firstName, lastName, mobile, email, message } = req.body;

  if (!firstName || !lastName || !mobile || !email || !message) {
    return res.status(400).json({ error: "Semua kolom harus diisi!" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: "Pesan Baru dari Website Portfolio",
    text: `
      Nama: ${firstName} ${lastName}
      Email: ${email}
      Nomor HP: ${mobile}
      Pesan:
      ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Pesan berhasil dikirim ke email Anda!" });
  } catch (error) {
    console.error("Error mengirim email:", error);
    res.status(500).json({ error: "Gagal mengirim email." });
  }
});

// ✅ Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
