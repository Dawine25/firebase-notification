import firebaseAdmin from 'firebase-admin';
import express from 'express';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

// Créer une fonction require pour charger des modules CommonJS
const require = createRequire(import.meta.url);

// Charger les variables d'environnement à partir de .env
config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

// Maintenant, vous pouvez utiliser process.env pour accéder aux variables d'environnement
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH);


// import serviceAccount from process.env.SERVICE_ACCOUNT_KEY_PATH assert { type: 'json' };


firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json());
//dj/
app.get('/send-notification', async (req, res) => {
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

