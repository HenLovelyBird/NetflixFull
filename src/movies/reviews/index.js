const express = require("express")
const fs = require("fs-extra")
const { check, validationResult, sanitizeBody } = require("express-validator")

const path = require("path")
const reviewsPath = path.join(__dirname, "reviews.json")

const router = express.Router();

//  CRUD for Reviews ( /reviews GET, POST, DELETE, PUT)

// {
//     "_id": "123455", //SERVER GENERATED
//     "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
//     "rate": 3, //REQUIRED, max 5
//     "elementId": "5d318e1a8541744830bef139", //REQUIRED = IMDBID
//     "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
// }

router.get("/", async (req, res) => {

}); 

router.post("/", async (req, res) => {

});

router.delete("/", async (req, res) => {

});

reouter.put("/", async (req, res) => {

})

module.exports = router;