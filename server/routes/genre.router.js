const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

router.get("/:id", (req, res) => {
  console.log("GET GENRES");
  // Add query to get all genres
  console.log(req.params.id);
  const movieId = [req.params.id];
  const queryString = `SELECT genres.name FROM movies 
                      JOIN movies_genres ON movies.id = movies_genres.movie_id
                      JOIN genres ON movies_genres.genre_id = genres.id
                      WHERE movies.id = $1;`;

  pool
    .query(queryString, movieId)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
