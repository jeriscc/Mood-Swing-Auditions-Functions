import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as _cors from "cors";

const cors = _cors({ origin: true });

type Auditionee = {
  id: string;
  name: string;
  number: Number;
  picture: string;
};

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
      return auditioneesRef.add(req.body).then(ref => {
        res.status(200).json({
          message: "Added document with ID: " + ref.id,
        })
      }).catch(err => {
        res.status(err.code).json({
          message: `Error posting document. ${err.message}`
        })
      });
    });
  }
);

export const getAuditionees = functions.https.onRequest(
  (req: functions.Request, res: functions.Response) => {
    return cors(req, res, () => {
      if (req.method !== "GET") {
        return res.status(404).json({
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
              picture: doc.data().picture
            });
          });
          res.status(200).json(auditionees);
        })
        .catch(err => {
          res.status(err.code).json({
            message: `Error getting documents. ${err.message}`
          })
        });
    });
  }
);

export const helloWorld = functions.https.onRequest(
  (req: functions.Request, res: functions.Response) => {
    res.send("Hello from Firebase!");
  }
);
