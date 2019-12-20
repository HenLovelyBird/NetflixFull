const express = require("express")
const fs = require("fs-extra")
const { check, validationResult, sanitizeBody } = require("express-validator")
const uuid = require ("uuid/v4")

const path = require("path")
const reviewsPath = path.join(__dirname, "reviews.json")

const router = express.Router();

//  CRUD for Reviews ( /reviews GET, POST, DELETE, PUT)

const getReviews = async()=>{
    const buffer = await fs.readFile(reviewsPath);
    return JSON.parse(buffer.toString())
}

router.get("/", async (req, res) => {
    res.send(await getReviews())
}); 

router.get("/:id", async (req, res)=>{
    const reviews = await getReviews()
    const review = reviews.find(gr => gr._id === req.params.id);
    if (review) 
        res.send(review) 
    else
        res.status(404).send("Review Not Found")
});

// {
//     "_id": "123455", //SERVER GENERATED
//     "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
//     "rate": 3, //REQUIRED, max 5
//     "elementId": "5d318e1a8541744830bef139", //REQUIRED = IMDBID
//     "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
// }
router.post("/",
    [check("comment").exists().withMessage("A comment is necessary"),
    sanitizeBody("rate").toInt({min:0,max:5}),
    check("elementID").exists().withMessage("imdbID is required"),
    ]
    ,async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            res.status(400).send(errors)
        try {
            const reviews = await getReviews();
            const newReview = {
                ...req.body,
                _id: uuid(),
                createdAt: new Date()
                }

        reviews.push(newReview)
        await fs.writeFile(reviewsPath, JSON.stringify(reviews))
        res.status(201).send("Post Successful!")
        } catch (error) {
            console.log(error);
            next(error);
        }
    })

    router.delete("/:id", async(req, res) => {
        const reviews = await getReviews()
        const reviewsToBeSaved = reviews.filter(dr => dr._id !== req.params.id)
        if (reviewsToBeSaved.length === reviews.length)
            res.status(404).send("Cannot Find Review " + req.params.id)
        else { 
            await fs.writeFile(reviewsPath, JSON.stringify(reviewsToBeSaved))
            res.send("Deleted")
        }
    });

    router.put("/:id", async(req, res)=>{
        const reviews = await getReviews()
        const reviewToEdit = reviews.find(mr => mr._id === req.params.id);
        if (reviewToEdit)
        {
            const position = reviews.indexOf(reviewToEdit);
            const updateReview = Object.assign(reviewToEdit, req.body)
            reviews[position] = updateReview;
            await fs.writeFile(reviewsPath, JSON.stringify(reviews))
            res.status(200).send("Updated!")
        }
        else
            res.status(404).send("Not found")
    });

module.exports = router;