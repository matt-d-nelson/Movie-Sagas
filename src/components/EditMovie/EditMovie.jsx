import {
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

function EditMovie() {
  //--------------------Imported Functions--------------------//
  const history = useHistory();
  const dispatch = useDispatch();

  //--------------------Reducer State--------------------//
  const movies = useSelector((store) => store.movies);
  const thisGenres = useSelector((store) => store.genres);

  // load id from url params and use that id to find the matching movie from the movies reducer
  const thisId = useParams();
  const thisMovie = movies.find((movie) => movie.id === Number(thisId.id));

  //--------------------Local State--------------------//
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [posterPath, setPosterPath] = useState("none selected");
  const [genres, setGenres] = useState({
    adventure: false,
    animated: false,
    biographical: false,
    comedy: false,
    disaster: false,
    drama: false,
    epic: false,
    fantasy: false,
    musical: false,
    romantic: false,
    scienceFiction: false,
    spaceOpera: false,
    superhero: false,
  });

  // for confirmation dialog
  const [open, setOpen] = useState(false);

  //--------------------Use Effects--------------------//
  // fetch all movies and this movie's genres on page load
  useEffect(() => {
    dispatch({ type: "FETCH_MOVIES" });
    dispatch({ type: "FETCH_GENRES", payload: thisId.id });
  }, []);

  // set local state to this movie's reducer data after page load and when thisMovie is changed
  // only if thisMovie has a defined value
  useEffect(() => {
    if (thisMovie != undefined) {
      setTitle(thisMovie.title);
      setDescription(thisMovie.description);
    }
  }, [thisMovie]);

  // set local state to this movie's genre reducer data after page load and when thisGenres is changed
  // only if thisGenres has a defined value
  useEffect(() => {
    if (thisGenres != undefined) {
      // create template object with same structure as the local genres state
      const returnGenres = {
        adventure: false,
        animated: false,
        biographical: false,
        comedy: false,
        disaster: false,
        drama: false,
        epic: false,
        fantasy: false,
        musical: false,
        romantic: false,
        scienceFiction: false,
        spaceOpera: false,
        superhero: false,
      };
      // loop through the genres from the reducer
      // all genres in this array need to be set to true in the returnGenres object
      for (let i = 0; i < thisGenres.length; i++) {
        // convert from dom format to camelCase
        // convert name to lower case
        thisGenres[i].name = thisGenres[i].name.toLowerCase();
        // special conditions for Sience Fiction and Space-Opera genres
        if (thisGenres[i].name === "science fiction") {
          thisGenres[i].name = "scienceFiction";
        }
        if (thisGenres[i].name === "space-opera") {
          thisGenres[i].name = "spaceOpera";
        }
        // set param to be true in return object
        returnGenres[thisGenres[i].name] = true;
      }
      console.log(returnGenres);
      // update local state with the resulting object so that
      // loaded genres have their boxes checked and values set to true
      setGenres(returnGenres);
    }
  }, [thisGenres]);

  //--------------------Event Handlers--------------------//

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePosterChange = (event) => {
    setPoster(event.target.files[0]);
    // split path at "\" and set to last value to get only the filename
    let splitPath = event.target.value.split("\\");
    setPosterPath(splitPath[splitPath.length - 1]);
  };

  const handleGenreChange = (event) => {
    setGenres({
      ...genres,
      [event.target.name]: event.target.checked,
    });
  };

  // gather form data and send saga dispatch for PUT request
  // poster will be updated if one was uploaded, otherwise currPoster will be used
  const gatherInputData = () => {
    const newMovie = new FormData();
    newMovie.append("id", thisId.id);
    newMovie.append("title", title);
    newMovie.append("description", description);
    newMovie.append("poster", poster);
    newMovie.append("currPoster", thisMovie.poster);
    newMovie.append("genres", JSON.stringify(genres));

    dispatch({ type: "EDIT_MOVIE", payload: newMovie });
    // there is a race condition issue when navigating back to the movie's details page
    // potentially resolve by loading confirmation screen pop before navigation
    // navigate back to movie lists
    // alert("movie added");
    // history.push(`/description/${thisId.id}`);

    //open confirmation dialog
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    history.push(`/description/${thisId.id}`);
  };

  const cancelAdd = () => {
    history.push(`/description/${thisId.id}`);
  };

  //--------------------JSX Return--------------------//
  return (
    <div style={{ paddingTop: "1%" }}>
      {title === "" ? (
        <Typography>loading...</Typography>
      ) : (
        <div>
          <Typography variant="h3" color="primary" className="outlined">
            Edit Movie
          </Typography>
          <Grid
            container
            spacing={2}
            style={{
              paddingLeft: "15%",
              paddingRight: "15%",
              paddingTop: "1%",
              margin: "0",
              width: "100%",
            }}
          >
            <Grid item xs={4}>
              <img src={thisMovie.poster} alt={thisMovie.title} width="300" />
              <br />
              <Button component="label" variant="contained" color="primary">
                <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                  Change Poster
                </Typography>
                <input
                  name="picture"
                  type="file"
                  hidden
                  onChange={handlePosterChange}
                />
              </Button>
              <Typography color="primary">{posterPath}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <TextField
                    variant="filled"
                    label="Title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    variant="filled"
                    label="Description"
                    value={description}
                    multiline
                    rows={20}
                    onChange={handleDescriptionChange}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Button
                    onClick={gatherInputData}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "10px" }}
                  >
                    <Typography
                      variant="h7"
                      style={{ color: "rgb(226,146,55)" }}
                    >
                      Submit
                    </Typography>
                  </Button>
                  <Button
                    onClick={cancelAdd}
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "10px" }}
                  >
                    <Typography
                      variant="h7"
                      style={{ color: "rgb(226,146,55)" }}
                    >
                      Cancel
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <FormLabel component="legend">Genres</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.adventure}
                      name="adventure"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Adventure"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.animated}
                      name="animated"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Animated"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.biographical}
                      name="biographical"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Biographical"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.comedy}
                      name="comedy"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Comedy"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.disaster}
                      name="disaster"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Disaster"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.drama}
                      name="drama"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Drama"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.epic}
                      name="epic"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Epic"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.fantasy}
                      name="fantasy"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Fantasy"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.musical}
                      name="musical"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Musical"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.romantic}
                      name="romantic"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Romantic"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.scienceFiction}
                      name="scienceFiction"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Science Fiction"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.spaceOpera}
                      name="spaceOpera"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Space-Opera"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.superhero}
                      name="superhero"
                      onChange={handleGenreChange}
                    />
                  }
                  label="Superhero"
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Dialog open={open} onClose={closeDialog}>
            <div
              style={{
                backgroundImage: "url(images/static/woodPaneling.jpeg)",
              }}
            >
              <DialogTitle>
                <div>
                  <Typography variant="h4" color="primary" className="outlined">
                    Success!
                  </Typography>
                </div>
              </DialogTitle>
              <DialogContent>
                <img src="images/static/vcrTracking.gif" width="300" />
                <Typography variant="h6" color="primary">
                  {thisMovie.title} has been updated.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={closeDialog}
                  variant="contained"
                  color="primary"
                >
                  <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                    Return
                  </Typography>
                </Button>
              </DialogActions>
            </div>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default EditMovie;
