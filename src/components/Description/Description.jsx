import {
  Button,
  List,
  ListItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  ButtonGroup,
  Box,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

function Description() {
  //--------------------Imported Functions--------------------//
  const history = useHistory();
  const dispatch = useDispatch();

  //--------------------Reducer State--------------------//
  const genres = useSelector((store) => store.genres);
  const movies = useSelector((store) => store.movies);

  // load id from url param
  const thisId = useParams();
  // use that id to find the matching movie from the movies reducer
  const thisMovie = movies.find((movie) => movie.id === Number(thisId.id));

  // fetch all movies and genres for this movie on page load
  useEffect(() => {
    dispatch({ type: "FETCH_MOVIES" });
    dispatch({ type: "FETCH_GENRES", payload: thisId.id });
  }, []);

  //--------------------Local State--------------------//
  // for confirmation dialog
  const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  //--------------------Event Handlers--------------------//
  const toList = () => {
    history.push("/");
  };

  const toEdit = () => {
    // navagates to edit page with this movie's id as a url param
    history.push(`/edit/${thisId.id}`);
  };

  // open confirm delete dialog on delete button click
  const confirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  // open success dialog when movie is deleted
  const deleteMovie = () => {
    setOpenConfirmDelete(false);
    // saga dispatch DELETE request
    dispatch({ type: "DELETE_MOVIE", payload: thisId.id });
    setOpenDeleteSuccess(true);
  };

  // close confirm dialog
  const closeConfirmDialog = () => {
    setOpenConfirmDelete(false);
  };

  // close delete success dialog
  const closeDialog = () => {
    setOpenDeleteSuccess(false);
    history.push(`/`);
  };

  //--------------------JSX Return--------------------//
  return (
    <div>
      {/* if the dispatch has not yet returned a value, render a placeholder component, else render movie data */}
      {thisMovie === undefined ? (
        <Typography>loading...</Typography>
      ) : (
        <div
          style={{ paddingLeft: "20%", paddingRight: "20%", paddingTop: "1%" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" color="primary" className="outlined">
                {thisMovie.title}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <img src={thisMovie.poster} alt={thisMovie.title} width="300" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="primary">
                {thisMovie.description}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" color="primary" className="outlined">
                Genres:
              </Typography>
              <List>
                {genres.map((genre) => {
                  return (
                    <ListItem
                      key={genre.name}
                      style={{ justifyContent: "center" }}
                    >
                      <Typography color="primary">{genre.name}</Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={toEdit}
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                  Edit
                </Typography>
              </Button>
              <br />
              <Button
                onClick={confirmDelete}
                variant="contained"
                color="secondary"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                  Delete
                </Typography>
              </Button>
              <br />
              <Button
                onClick={toList}
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                  Back
                </Typography>
              </Button>
            </Grid>
          </Grid>

          <Dialog open={openConfirmDelete} onClose={closeDialog}>
            <div
              style={{
                backgroundImage: "url(images/static/woodPaneling.jpeg)",
              }}
            >
              <DialogTitle>
                <div>
                  <Typography variant="h4" color="primary" className="outlined">
                    Are you sure?
                  </Typography>
                </div>
              </DialogTitle>
              <DialogContent>
                <img src="images/static/glitchVHS.gif" width="300" />
                <Typography variant="h6" color="primary">
                  {thisMovie.title} will be ejected from existance.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={closeConfirmDialog}
                  variant="contained"
                  color="primary"
                >
                  <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                    Cancel
                  </Typography>
                </Button>
                <Button
                  onClick={deleteMovie}
                  variant="contained"
                  color="secondary"
                >
                  <Typography variant="h7" style={{ color: "rgb(226,146,55)" }}>
                    Delete
                  </Typography>
                </Button>
              </DialogActions>
            </div>
          </Dialog>

          <Dialog open={openDeleteSuccess} onClose={closeDialog}>
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
                <img src="images/static/ejectVHS.gif" width="300" />
                <Typography variant="h6" color="primary">
                  {thisMovie.title} has been deleted.
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

export default Description;
