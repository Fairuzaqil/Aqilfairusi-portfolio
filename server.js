require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
