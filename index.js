import express, { json } from 'express';
import { initializeApp, credential as _credential, messaging } from 'firebase-admin';
import serviceAccount from './config/getymoney-59ce1-firebase-adminsdk-lyijq-33cd6dfb6e.json';

initializeApp({
  credential: _credential.cert(serviceAccount)
});

const app = express();
app.use(json());

app.post('/send-notification', (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.status(200).send({ success: true });
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(500).send({ success: false, error: error.message });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
