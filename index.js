// import firebaseAdmin from 'firebase-admin';
// import express from 'express';
// import { config } from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { createRequire } from 'module';

// // Créer une fonction require pour charger des modules CommonJS
// const require = createRequire(import.meta.url);

// // Charger les variables d'environnement à partir de .env
// config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

// // Maintenant, vous pouvez utiliser process.env pour accéder aux variables d'environnement
// const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH);


// // import serviceAccount from process.env.SERVICE_ACCOUNT_KEY_PATH assert { type: 'json' };


// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount)
// });

// const app = express();
// app.use(express.json());
// //dj/
// app.post('/send-notification', async (req, res) => {
//   const { token, title, body } = req.body;

//   const message = {
//     notification: {
//       title: title,
//       body: body,
//     },
//     token: token,
//   };

//   try {
//     const response = await firebaseAdmin.messaging().send(message);
//     console.log('Successfully sent message:', response);
//     res.status(200).send({ success: true });
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).send({ success: false, error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


import { promises as fs } from 'fs';
import path from 'path';
import admin from 'firebase-admin';

export default async function handler(req, res) {
  try {
    const filePath = path.resolve(process.cwd(), 'config/getymoney-59ce1-944760c5f21d.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const serviceAccount = JSON.parse(fileContent);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    const { token, title, body } = req.body;

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    const response = await admin.messaging().send(message);

    res.status(200).json({ message: 'Notification sent successfully', response: response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

