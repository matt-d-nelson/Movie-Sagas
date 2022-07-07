require("dotenv").config();

const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const multer = require("multer");
const { cloudinary } = require("../modules/cloudinary");

// set up multer storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: imageStorage });

router.get("/", async (req, res, next) => {
  // get call to cloudinary api to fetch resource data
  const allPosters = await cloudinary.api.resources();
  console.log(allPosters);

  const query = `SELECT * FROM movies ORDER BY "title" ASC`;
  pool
    .query(query)
    .then((result) => {
      // loop through result rows
      result.rows.forEach((movie) => {
        // find the poster with the matching public id from cloudinary resources
        for (let i = 0; i < allPosters.resources.length; i++) {
          if (allPosters.resources[i].public_id === movie.poster) {
            // set movie.poster to its public url
            movie.poster = allPosters.resources[i].url;
          }
        }
      });
      console.log(result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all movies", err);
      res.sendStatus(500);
    });
});

router.put("/", upload.single("poster"), async (req, res, next) => {
  //************-UPDATE MOVIES TABLE-************//

  // gather update data in array / title 1, desc 2, id 3, poster 4
  const updateMovieValues = [req.body.title, req.body.description, req.body.id];

  // add new image path if uploaded, use previous if not
  if (req.body.poster === "") {
    updateMovieValues.push(req.body.currPoster);
  } else {
    // cloudinary upload
    const result = await cloudinary.uploader.upload(req.file.path);
    updateMovieValues.push(result.public_id);
  }
  console.log(updateMovieValues);
  const updateMovieQuery = `UPDATE movies 
          SET title = $1, description = $2, poster = $4
          WHERE id = $3;
          `;
  pool
    .query(updateMovieQuery, updateMovieValues)
    .then((result) => {
      //************-DELETE VALUES FROM MOVIES_GENRES TABLE-************//
      // remove all old genres from junction table
      console.log("DELETE GENRES");
      const deleteGenresId = [req.body.id];
      const deleteGenresQuery = `DELETE FROM movies_genres WHERE movie_id = $1;`;
      pool
        .query(deleteGenresQuery, deleteGenresId)
        .then((result) => {
          console.log("UPDATE GENRES");
          //************-UPDATE VALUES IN MOVIES_GENRES TABLE-************//
          // gather updated genres
          const updateMovieGenres = parseGenres(JSON.parse(req.body.genres));
          // create query string
          const updateMovieGenreQuery = createAddGenresQuery(updateMovieGenres);
          // add movie id to beginning of query values array
          updateMovieGenres.unshift(req.body.id);
          // send query to update movie genres
          pool
            .query(updateMovieGenreQuery, updateMovieGenres)
            .then((result) => {
              res.sendStatus(200);
            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.post("/", upload.single("poster"), async (req, res, next) => {
  // cloudinary upload
  const result = await cloudinary.uploader.upload(req.file.path);

  // structure data for query
  const newMovieValues = [
    req.body.title,
    // public url id retrieved from cloudinary after uploading
    result.public_id,
    req.body.description,
  ];
  // create array on genre id numbers based on client selection
  const newMovieGenres = parseGenres(JSON.parse(req.body.genres));

  console.log(newMovieGenres, newMovieValues);

  //RETURNING "id" will give us back the id of the created movie
  const insertMovieQuery = `
  INSERT INTO "movies" ("title", "poster", "description")
  VALUES ($1, $2, $3)
  RETURNING "id";`;

  // // FIRST QUERY MAKES MOVIE
  pool
    .query(insertMovieQuery, newMovieValues)
    .then((result) => {
      console.log("New Movie Id:", result.rows[0].id);
      //ID IS HERE!
      const createdMovieId = result.rows[0].id;

      // only add genres junction table query if genres were set in client
      if (newMovieGenres.length > 0) {
        // Now handle the genre reference
        const insertMovieGenreQuery = createAddGenresQuery(newMovieGenres);

        // add movie id to front of array
        newMovieGenres.unshift(createdMovieId);

        // SECOND QUERY ADDS GENRE FOR THAT NEW MOVIE
        pool
          .query(insertMovieGenreQuery, newMovieGenres)
          .then((result) => {
            //Now that both are done, send back success!
            res.sendStatus(201);
          })
          .catch((err) => {
            // catch for second query
            console.log(err);
            res.sendStatus(500);
          });
      }

      //Catch for first query
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  console.log(req.params.id);
  // delete all references to deleted movies id from movie_genres junction table
  const deletedMovieId = [req.params.id];
  const deleteJunctionQuery = `DELETE FROM movies_genres WHERE movie_id = $1;`;

  pool
    .query(deleteJunctionQuery, deletedMovieId)
    .then((result) => {
      const deleteMovieQuery = `DELETE FROM movies WHERE id = $1;`;
      pool
        .query(deleteMovieQuery, deletedMovieId)
        .then((result) => {
          res.sendStatus(200);
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

function parseGenres(genresToParse) {
  // helper object that maps genre names to matching genre_id in DB
  const genreKey = {
    adventure: 1,
    animated: 2,
    biographical: 3,
    comedy: 4,
    disaster: 5,
    drama: 6,
    epic: 7,
    fantasy: 8,
    musical: 9,
    romantic: 10,
    scienceFiction: 11,
    spaceOpera: 12,
    superhero: 13,
  };
  console.log(genresToParse);
  // declare array to push genres to
  const returnValues = [];
  // loop through the parameters (genre names) in sent object
  for (const genre in genresToParse) {
    // if the perameter (genre) is set to true
    if (genresToParse[genre] === true) {
      // push it to the returnValues array
      returnValues.push(genreKey[genre]);
    }
  }
  return returnValues;
}

function createAddGenresQuery(genresToAdd) {
  // beginning query
  returnQuery = `INSERT INTO "movies_genres" ("movie_id", "genre_id") VALUES`;
  // concatinate query for every genre to add
  for (let i = 0; i < genresToAdd.length; i++) {
    returnQuery += `($1, $${i + 2}),`;
  }
  // remove last ","
  returnQuery = returnQuery.slice(0, -1);
  // add ";"
  returnQuery += ";";
  return returnQuery;
}

module.exports = router;
