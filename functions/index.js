const functions = require("firebase-functions");

const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const { response } = require("express");
const app = express();

app.use(cors({ origin: true }));
const db = admin.firestore();
// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Hai there");
});

// POST - mountain
app.post("/api/mountain", (req, res) => {
  (async () => {
    try {
      await db.collection("mountains").doc(`/${Date.now()}/`).create({
        id: Date.now(),
        name: req.body.name,
        photo_url: req.body.photo_url,
        info: req.body.info,
        hikingClubs: req.body.hikingClubs,
        routes: req.body.routes,
      });

      return res.status(200).send({ msg: "Data Saved" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// GET - mountain/:id
app.get("/api/mountain/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("mountains").doc(req.params.id);
      let mountainDetail = await reqDoc.get();
      let response = mountainDetail.data();

      return res.status(200).send({ data: response });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// PUT - mountain/update/:id
app.put("/api/mountain/update/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("mountains").doc(req.params.id);
      await reqDoc.update({
        id: Date.now(),
        name: req.body.name,
        photo_url: req.body.photo_url,
        info: req.body.info,
        hikingClubs: req.body.hikingClubs,
        routes: req.body.routes,
      });
      return res.status(200).send({ status: "Success", msg: "Data Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// DELETE - mountain/:id
app.delete("/api/mountain/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("mountains").doc(req.params.id);
      await reqDoc.delete();
      return res.status(200).send({ status: "Success", msg: "Data Removed" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// read all user details
// get
app.get("/api/userDetails", (req, res) => {
  (async () => {
    try {
      let query = db.collection("userdetails");
      let response = [];

      await query.get().then((data) => {
        let docs = data.docs; // query results

        docs.map((doc) => {
          const selectedData = {
            name: doc.data().name,
            mobile: doc.data().mobile,
          };

          response.push(selectedData);
        });
        return response;
      });

      return res.status(200).send({ status: "Success", data: response });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// Exports api to the firebase cloud functions
exports.app = functions.https.onRequest(app);
