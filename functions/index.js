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



// Mountains API //
/////////////////////////////////////////////////////////////////////////////////

// POST - mountain
app.post("/api/mountain", (req, res) => {
  (async () => {
    try {
      await db.collection("mountains").doc(`/${Date.now()}/`).create({
        id: Date.now(),
        name: req.body.name,
        yt: req.body.yt,
        photo_url: req.body.photo_url,
        info: req.body.info,
        hikingClubs: req.body.hikingClubs,
        routes: req.body.routes,
        saved: req.body.saved
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

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});


// GET saved mountains
app.get("/api/saved", (req, res) => {
  (async () => {
    try {
      const query = db.collection("mountains")

      let response = []
      await query.get().then((data) => {
        let docs = data.docs

        docs.map((doc) => {

          if (doc.data().saved === true) {
            const selectedItem = {
              id: doc.data().id,
              name: doc.data().name,
              yt: doc.data().yt,
              photo_url: doc.data().photo_url,
              info: doc.data().info,
              hikingClubs: doc.data().hikingClubs,
              routes: doc.data().routes,
              saved: doc.data().saved
            }

            response.push(selectedItem)
          }
        })
      })


      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: "GET saved mountains" });
    }
  })();
});

// PUT - mountain/update/:id

app.put("/api/mountain/update/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("mountains").doc(req.params.id);
      await reqDoc.update({
        name: req.body.name,
        yt: req.body.yt,
        photo_url: req.body.photo_url,
        info: req.body.info,
        hikingClubs: req.body.hikingClubs,
        routes: req.body.routes,
        saved: req.body.saved
      })

      return res.status(200).send({ msg: "Data Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// app.put("/api/mountain/update/:id", (req, res) => {
//   (async () => {
//     try {
//       const reqDoc = db.collection("mountains").doc(req.params.id);
//       await reqDoc.update({
//         name: req.body.name,
//         yt: req.body.yt,
//         photo_url: req.body.photo_url,
//         info: req.body.info,
//         hikingClubs: req.body.hikingClubs,
//         routes: req.body.routes,
//         saved: req.body.saved
//       });
//       return res.status(200).send({ status: "Success", msg: "Data Updated" });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({ status: "Failed", msg: error });
//     }
//   })();
// });

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



// Cities API //
/////////////////////////////////////////////////////////////////////////////////

// POST - /city
app.post("/api/city", (req, res) => {
  (async () => {
    try {
      await db.collection("cities").doc(`/${Date.now()}/`).create({
        id: Date.now(),
        name: req.body.name,
        photo_url: req.body.photo_url,
        mountains: req.body.mountains,
      });

      return res.status(200).send({ msg: "Data Saved" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// GET - city/:id
app.get("/api/city/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("cities").doc(req.params.id);
      let cityDetail = await reqDoc.get();
      let response = cityDetail.data();

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// PUT - city/update/:id
app.put("/api/city/update/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("cities").doc(req.params.id);
      await reqDoc.update({
        id: Date.now(),
        name: req.body.name,
        photo_url: req.body.photo_url,
        mountains: req.body.mountains,
      });
      return res.status(200).send({ status: "Success", msg: "Data Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// DELETE - mountain/:id
app.delete("/api/city/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("cities").doc(req.params.id);
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
app.get("/api/cities", (req, res) => {
  (async () => {
    try {
      let query = db.collection("cities");
      let response = [];

      await query.get().then((data) => {
        let docs = data.docs; // query results

        docs.map((doc) => {
          const selectedData = {
            id: doc.data().id,
            name: doc.data().name,
            photo_url: doc.data().photo_url,
            mountains: doc.data().mountains,
          };

          response.push(selectedData);
        });
        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});



// Exports api to the firebase cloud functions
exports.app = functions.https.onRequest(app);



