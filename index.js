const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const { google } = require('googleapis');
const CLIENT_ID = '138882240376-jjakdbgcqq8ig5ef523vcesvkfih85c7.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//048rdJnET1eAMCgYIARAAGAQSNwF-L9Irjk2u0tnOXGp8MEreUsup6FS0QZtemlA0psIOnA_Fv_OC5X2qiedvXHBMpx6UGQCU0LU';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = process.env.PORT || 5000;

app.use('/v1', route);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// new google transporter
const accessToken = oAuth2Client.getAccessToken();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'shoaib.psota@gmail.com',
      clientId: CLIENT_ID,
      clientSecret: CLEINT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
route.post('/text-mail', (req, res) => {
    const {name,phoneNumber,email,message} = req.body;
    const mailData = {
        from: 'shoaib.psota@gmail.com',
        to: 'info@redpositive.in',
        subject: 'Response from contact us!',
        text: name + phoneNumber + email + message ,
        html: `<b>Name: ${name}</b><br>Phone Number: ${phoneNumber}<br>Email Id: ${email}<br>Messgae: ${message}</br>`,
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});


