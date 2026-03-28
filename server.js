const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('/views'));


app.use((req, res, next) => {
  console.log("request body: ", req.body);
  console.log(req.method + ' ' + req.url + ' was requested at ' + Date(Date.now()).toString());
  next();
})

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: process.env.TRANSPORTER_PORT,
  secure: false,
  tls: {
    rejectUnauthorized: false  // For self-signed certs
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Force IPv4
  socketTimeout: 60000,
  connectionTimeout: 60000
});


app.get("/", async (req, res, next) => {
  res.render("home");
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get("/customize", async (req, res, next) => {
  res.render("customize");
});

app.post("/customize", upload.single('imageUpload'), async (req, res, next) => {
    console.log('Guitar Build Received:', req.body);
    console.log('Uploaded file:', req.file);
  
    try {
      const emailBody = `
  New Guitar Build Submission:
  
  ${JSON.stringify(req.body, null, 2)}
  `;
  
      const attachments = [];
  
      if (req.file) {
        attachments.push({
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype
        });
      }
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TARGET,
        subject: 'New Guitar Build Specs',
        text: emailBody,
        html: `<pre>${emailBody}</pre>`,
        attachments
      });
  
      res.json({
        success: true,
        message: 'Build specs saved and emailed!'
      });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({
        success: false,
        message: 'Build saved but email failed'
      });
    }
  });

//port
app.listen(process.env.PORT || 8099);
