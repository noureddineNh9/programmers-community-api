const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const mysql = require("mysql");

const UserControllers = require("./controllers/User");
const ProjectControllers = require("./controllers/Project");
const ProgrammerController = require("./controllers/Programmer");
const TacheController = require("./controllers/Tache");
const SousTacheController = require("./controllers/SousTache");

const { con } = require("./db");

/*
var con = mysql.createConnection({
   host: "localhost",
   database: "espace_programmeur_db",
   user: "root",
   password: "",
});

con.connect(function (err) {
   if (err) throw err;
   console.log("Connected!");
});

var con = mysql.createConnection({
   host: "localhost",
   database: "espace_programmeur_db",
   user: "root",
   password: "",
});

con.connect(function (err) {
   if (err) throw err;
   console.log("Connected!");
});
*/

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads/images", express.static("./uploads/images"));

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./uploads/images");
   },
   filename: function (req, file, cb) {
      const newName = Date.now() + "." + file.originalname.split(".").pop();

      cb(null, newName);
      /*
      const imageUrl =
         req.protocol + "://" + req.get("host") + "/uploads/images/" + newName;

      pool
         .query(
            `update employees set image_url = '${imageUrl}' where employee_id=${req.body.employeeId}`
         )
         .then((data) => {
            cb(null, newName);
         })
         .catch((err) => {
            throw err;
         });
         */
   },
});
const fileFilter = (req, file, cb) => {
   if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
   ) {
      cb(null, true);
   } else {
      cb(null, false);
   }
};

var uploadImage = multer({
   storage: storage,
   fileFilter: fileFilter,
});
app.get("/", (request, response) => {
   console.log();
   response.send("It's working!");
});

//************************** User ************************/

app.post("/login", (req, res) => {
   UserControllers.login(req, res, con);
});

app.post("/register", uploadImage.single("image_profile"), async (req, res) => {
   if (req.file) {
      UserControllers.register(req, res, con);
   } else {
      res.status(400).send("no image uploaded");
   }
});

//************************** Project ************************/

app.get("/projets", (req, res) => {
   ProjectControllers.getAllProjects(req, res, con);
});

app.get("/projet/:id", (req, res) => {
   ProjectControllers.getProjet(req, res, con);
});

app.post("/projet", (req, res) => {
   ProjectControllers.setProjet(req, res, con);
});

app.get("/projetsByProprietaire/:id", (req, res) => {
   ProjectControllers.getProjetsByProprietaire(req, res, con);
});

//************************** Programmer ************************/

app.get("/programmer/:id", (req, res) => {
   ProgrammerController.getProgrammer(req, res, con);
});

app.get("/programmersBySousTache/:id", (req, res) => {
   ProgrammerController.getProgrammersBySousTache(req, res, con);
});

//************************** Tache ************************/

app.get("/tacheByProjet/:id", (req, res) => {
   TacheController.getTachesByProjet(req, res, con);
});

app.post("/tache", (req, res) => {
   TacheController.setTache(req, res, con);
});

//************************** SousTache ************************/

app.get("/sousTacheByTache/:id", (req, res) => {
   SousTacheController.getSousTacheByTache(req, res, con);
});

//**************************************************/

app.listen(process.env.PORT || 4000, () => {
   console.log(
      `app is running on port ${process.env.PORT ? process.env.PORT : 4000}`
   );
});
