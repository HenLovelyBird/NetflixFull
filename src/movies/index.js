const express = require("express")
const fs = require("fs-extra")
const { check, validationResult, sanitizeBody } = require("express-validator")

const path = require("path")
const moviesPath = path.join(__dirname, "movies.json")

const router = express.Router();

//  CRUD for movies ( /media GET, POST, DELETE, PUT)

    const getMoviess = async()=>{
        const buffer = await fs.readFile(moviesPath);
        return JSON.parse(buffer.toString())
    }

router.get("/", async (req, res) => {
    res.send(await getMoviess());
}); 

router.get("/:id", async (req, res)=>{
    const movies = await getMovies()
    const movie = movie.find(b => b.imdbID === req.params.id);
    if (movie)
        res.send(movies)
    else
        res.status(404).send("imdbID" + `${imdbID}` + "Not Found")
});
    //         "Title": "The Lord of the Rings: The Fellowship of the Ring",
    //         "Year": "2001",
    //         "imdbID": "tt0120737",
    //         "Type": "movie",
    //         "Poster": 
router.post("/",
    [check("Title").exists().withMessage("Title is required"),
    sanitizeBody("Year").toInt(),
    check("imdbID").exists().withMessage("imdbID is required"),
    check("Type").isNumeric().withMessage("Type is required"),]
    ,async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            res.status(400).send(errors)

        const movies = await getMovies()
        const checkID = movies.find(pm => pm.imdbID === req.body.id) 
        if (checkID)
            res.status(500).send("Please check the ID")

        movies.push(req.body)
        await fs.writeFile(moviesPath, JSON.stringify(movies))
        res.status(201).send("Post Successful!")
    })

    router.delete("/:id", async(req, res) => {
        const movies = await getMovies()
        const moviesToBeSaved = movies.filter(dm => dm.imdbID !== req.params.id)
        if (moviesToBeSaved.length === movies.length)
            res.status(404).send("Cannot Find Movie " + req.params.id)
        else { 
            await fs.writeFile(moviesPath, JSON.stringify(moviesToBeSaved))
            res.send("Deleted")
        }
    });

    router.put("/:id", async(req, res)=>{
        const movies = await getMovies()
        const movieToEdit = movies.find(mte => mte.imdbID === req.params.id);
        if (movieToEdit)
        {
            const position = movies.indexOf(movieToEdit);
            const updateMovie = Object.assign(movieToEdit, req.body)
            movies[position] = updateMovie;
            await fs.writeFile(moviePath, JSON.stringify(movies))
            res.status(200).send("Updated!")
        }
        else
            res.status(404).send("Not found")
    });

module.exports = router;