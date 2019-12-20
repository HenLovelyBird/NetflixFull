const express = require("express")
const server = express();
const moviesRouter = require("./src/movies")
const reviewsRouter = require("./src/reviews")
const cors = require("cors")

var whitelist = ['http://localhost:3000','http://localhost:5000']
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

server.use(express.json())
server.use(cors(corsOptions))
server.use("/movies", moviesRouter)
server.use("/reviews", reviewsRouter)

const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log("Howdy, I'm listening on port " + port)
})