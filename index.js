import firebaseAdmin from 'firebase-admin';
import express from 'express';
import dotenv  from 'dotenv';
import bodyParser from 'body-parser';
import { readFile } from 'fs/promises';
import cors from 'cors'
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
// const serviceAccount = JSON.parse(
//   await readFile(new URL(serviceAccountPath, import.meta.url))
// );

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount)
// });

async function initializeFirebase() {
  const serviceAccountBase64 = process.env.SERVICE_ACCOUNT_KEY_PATH;
  const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
  const serviceAccount = JSON.parse(serviceAccountJson);

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
}

initializeFirebase();
const firestore =firebaseAdmin.firestore();
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

app.post('/message', async (req, res) => {
  const { token, title, body , data } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: data,
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

app.post('/disableUser', async (req, res) => {
  const uid = req.body.uid;
  try {
    await firebaseAdmin.auth().updateUser(uid, { disabled: true });
    res.status(200).send('Utilisateur désactivé avec succès');
  } catch (error) {
    res.status(500).send(`Erreur lors de la désactivation de l'utilisateur: ${error}`);
  }
});


app.post('/activeUser', async (req, res) => {
  const uid = req.body.uid;
  try {
    await firebaseAdmin.auth().updateUser(uid, { disabled: false });
    res.status(200).send('Utilisateur activé avec succès');
  } catch (error) {
    res.status(500).send(`Erreur lors de la désactivation de l'utilisateur: ${error}`);
  }
});


app.post('/deleteUser', async (req, res) => {
  const uid = req.body.uid;
  try {
    await firebaseAdmin.auth().deleteUser(uid);
    res.status(200).send('Utilisateur supprimé avec succès');
  } catch (error) {
    res.status(500).send(`Erreur lors de la suppression de l'utilisateur: ${error}`);
  }
});

app.get('/checkPlayerName/:name', async (req, res) => {
  const { name } = req.params;
  

  try {
    const querySnapshot = await firestore.collection('User').where('username', '==', name).get();

    if (!querySnapshot.empty) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification du nom:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du nom' });
  }
});

app.get('/checkPlayerNumber/:number', async (req, res) => {
  const { number } = req.params;
  

  try {
    const querySnapshot = await firestore.collection('User').where('number', '==', number).get();

    if (!querySnapshot.empty) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification du numero:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du numero' });
  }
});


app.get('/checkCoachName/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const querySnapshot = await firestore.collection('coach').where('username', '==', name).get();

    if (!querySnapshot.empty) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du nom:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du nom' });
  }
});

app.get('/checkCoachNumber/:number', async (req, res) => {
  const { number } = req.params;

  try {
    const querySnapshot = await firestore.collection('coach').where('number', '==', number).get();

    if (!querySnapshot.empty) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du nom:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du nom' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



