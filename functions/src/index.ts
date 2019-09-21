import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as _cors from "cors";
import { Auditionee, postSchema } from "./types";

const cors = _cors({ origin: true });

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const auditioneesRef = db.collection("auditionees");

export const postAuditionee = functions.https.onRequest(
  (req: functions.Request, res: functions.Response) => {
    return cors(req, res, () => {
      if (req.method !== "POST") {
        return res.status(401).json({
          message: "Not allowed"
        });
      }

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
  }
);

export const getAuditionee = functions.https.onRequest(
  (req: functions.Request, res: functions.Response) => {
    return cors(req, res, () => {
      if (req.method !== "GET") {
        return res.status(401).json({
          message: "Not allowed"
        });
      }
      const id = req.query.id;

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
    });
  }
);

export const getAuditionees = functions.https.onRequest(
  (req: functions.Request, res: functions.Response) => {
    return cors(req, res, () => {
      if (req.method !== "GET") {
        return res.status(401).json({
          message: "Not allowed"
        });
      }

      const auditionees: Auditionee[] = [];

      return auditioneesRef
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            auditionees.push({
              id: doc.id,
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
    });
  }
);
