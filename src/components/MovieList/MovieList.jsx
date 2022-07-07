import { Button, Grid, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import MovieItem from "../MovieItem/MovieItem";
import "./MovieList.css";

function MovieList() {
  //--------------------Imported Functions--------------------//
  const dispatch = useDispatch();
  const history = useHistory();

  //--------------------Reducer State--------------------//
  const movies = useSelector((store) => store.movies);

  // load movies on page load
  useEffect(() => {
    dispatch({ type: "FETCH_MOVIES" });
  }, []);

  //--------------------JSX Return--------------------//
  return (
    <main>
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "2%" }}
      >
        <Grid container justify="center" alignItems="center" spacing={10}>
          {movies.map((movie) => {
            return <MovieItem movie={movie} key={movie.id} />;
          })}
        </Grid>
      </div>
    </main>
  );
}

export default MovieList;
