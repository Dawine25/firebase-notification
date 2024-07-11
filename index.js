import express from 'express';
import firebaseAdmin from 'firebase-admin';
import serviceAccount from './config/getymoney-59ce1-firebase-adminsdk-lyijq-33cd6dfb6e.json' assert { type: 'json' };

// Initialisez l'application Firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json());

app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await firebaseAdmin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

