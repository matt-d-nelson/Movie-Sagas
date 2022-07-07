import { Button, Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

function Header() {
  const history = useHistory();

  //--------------------Event Handlers--------------------//
  const toAddMovie = () => {
    history.push("/addMovie");
  };
  return (
    <div>
      <Grid
        container
        style={{
          alignItems: "center",
          textAlign: "center",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingTop: "1%",
          paddingBottom: "1%",
          backgroundImage: "url(images/static/headerBkg.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "cover",
        }}
      >
        <Grid item xs={8}>
          <Typography variant="h2" color="primary" className="outlined">
            The Movies Saga!
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={toAddMovie} color="primary" variant="contained">
            {" "}
            <Typography variant="h6" style={{ color: "rgb(226,146,55)" }}>
              Add Movie
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Header;
