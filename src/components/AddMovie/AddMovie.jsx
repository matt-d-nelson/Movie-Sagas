import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function AddMovie() {
  //--------------------Imported Functions--------------------//

  const history = useHistory();
  const dispatch = useDispatch();

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

  //--------------------Event Handlers--------------------//

  const handleGenreChange = (event) => {
    setGenres({
      // spread operator to retain all params and values
      ...genres,
      // access the property name from genres that matched the check box that was clicked...
      // checkbox components have boolean checked prop based on if they are checked
      [event.target.name]: event.target.checked,
    });
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePosterChange = (event) => {
    setPoster(event.target.files[0]);
    let splitPath = event.target.value.split("\\");
    setPosterPath(splitPath[splitPath.length - 1]);
  };

  const gatherInputData = () => {
    // input verification
    if (title === "" || description === "" || poster === "") {
      alert("Please enter a Title, Description, and upload a Poster");
    } else {
      // gather data as form data for multer image upload
      const newMovie = new FormData();
      newMovie.append("title", title);
      newMovie.append("description", description);
      newMovie.append("poster", poster);
      newMovie.append("genres", JSON.stringify(genres));
      // send dispatch to saga POST with gathered data as payload
      dispatch({ type: "ADD_MOVIE", payload: newMovie });

      setOpen(true);
    }
  };

  const closeDialog = () => {
    setOpen(false);
    history.push(`/`);
  };

  const cancelAdd = () => {
    history.push("/");
  };

  //--------------------JSX Return--------------------//

  return (
    <div style={{ paddingTop: "1%" }}>
      <Typography variant="h3" color="primary" className="outlined">
        Add Movie
      </Typography>
      <Grid
        container
        spacing={2}
        style={{
          paddingLeft: "25%",
          paddingRight: "20%",
          paddingTop: "1%",
          margin: "0",
          width: "100%",
        }}
      >
        <Grid item xs={8}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                variant="filled"
                label="Title"
                onChange={handleTitleChange}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                variant="filled"
                label="Description"
                multiline
                rows={17}
                onChange={handleDescriptionChange}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button component="label" variant="contained" color="primary">
                <input
                  name="picture"
                  type="file"
                  hidden
                  onChange={handlePosterChange}
                />
                <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                  Upload Poster
                </Typography>
              </Button>
              <Typography color="primary">{posterPath}</Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={gatherInputData}
                variant="contained"
                color="primary"
                style={{ marginRight: "10px" }}
              >
                <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                  Submit
                </Typography>
              </Button>
              <Button
                onClick={cancelAdd}
                variant="contained"
                color="secondary"
                style={{ marginLeft: "10px" }}
              >
                <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                  Cancel
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <FormLabel component="legend" style={{ textAlign: "left" }}>
            Genres
          </FormLabel>
          <FormGroup style={{ color: "var(--primary)" }}>
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
            <img src="images/static/insertVHS.gif" width="300" />
            <Typography variant="h6" color="primary">
              {title} has been added.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} variant="contained" color="primary">
              <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                Return
              </Typography>
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}

export default AddMovie;
