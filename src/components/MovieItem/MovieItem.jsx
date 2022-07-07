import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

function MovieItem(props) {
  //--------------------Imported Functions--------------------//
  const history = useHistory();

  //--------------------Event Handlers--------------------//
  const toDetails = () => {
    // navigate to details page with id loaded as url param
    history.push(`/description/${props.movie.id}`);
  };

  //--------------------JSX Return--------------------//
  return (
    <Grid item md={6} lg={3}>
      <Card
        className="cardPar"
        style={{
          boxShadow: "none",
          backgroundImage: `url(${props.movie.poster})`,
          backgroundColor: "transparent",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <CardMedia onClick={toDetails}>
          <Typography variant="h5" color="primary" className="outlined">
            {props.movie.title}
          </Typography>
          <img
            src="images/static/vhsTape.png"
            alt={props.movie.title}
            width="250"
            className="vhsTape"
            style={{ transition: "all 0.75s ease-in-out" }}
          />
        </CardMedia>
      </Card>
    </Grid>
  );
}

export default MovieItem;
