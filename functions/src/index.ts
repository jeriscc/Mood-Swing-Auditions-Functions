import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { Auditionee, postSchema } from "./types";

const app = express();
app.use(cors({ origin: true }));

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const auditioneesRef = db.collection("auditionees");

app.post("/", (req, res) => {
  const { error, value } = postSchema.validate(req.body);

  if (error !== null) {
    console.log(error);
    return res.status(422).json({
      message: "Invalid input. " + error
    });
  }

  return auditioneesRef
    .add(value)
    .then(ref => {
      res.status(200).json({
        message: "Added document with ID: " + ref.id
      });
    })
    .catch(err => {
      res.status(err.code).json({
        message: `Error posting document. ${err.message}`
      });
    });
});

app.get("/:id", (req, res) => {
  const id = req.params.id;

  return auditioneesRef
    .doc(`${id}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({
          message: "No document found"
        });
      } else {
        res.status(200).json(doc.data());
      }
    })
    .catch(err => {
      res.status(err.code).json({
        message: `Error getting document. ${err.message}`
      });
    });
})

app.get("/", (req, res) => {
  const auditionees: Auditionee[] = [];

  return auditioneesRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        auditionees.push({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name,
          number: doc.data().number,
          picture: doc.data().picture,
          voice_part: doc.data().voice_part
        });
      });
      res.status(200).json(auditionees);
    })
    .catch(err => {
      res.status(err.code).json({
        message: `Error getting documents. ${err.message}`
      });
    });
})

export const auditionee = functions.https.onRequest(app);