import { HashRouter as Router, Route } from "react-router-dom";
import "./App.css";
import MovieList from "../MovieList/MovieList";
import { useSelector } from "react-redux";
import Description from "../Description/Description";
import { Typography } from "@material-ui/core";
import AddMovie from "../AddMovie/AddMovie";
import EditMovie from "../EditMovie/EditMovie";
import Header from "../Header/Header";

function App() {
  const movies = useSelector((store) => store.movies);

  // URL params allow for unique data to be stored in and accessed from the url SYNTAX: path="/someurlpath/:(name of param to be stored)""
  // The <Description /≥ component loads whenever "/description/" is accessed by clicking on a movie (the clicked movie's id is loaded as a url param e.g. "description/2")
  // It then loads the clicked movie's id from the url param and subsequentially loads that movie's infomation via various dispatches
  return (
    <div className="App">
      <Router>
        <Header />
        <Route path="/" exact>
          <MovieList />
        </Route>
        {/* Details page */}
        <Route path="/description/:id">
          <Description />
        </Route>
        {/* Add Movie page */}
        <Route path="/addMovie">
          <AddMovie />
        </Route>
        {/* Edit Movie page */}
        <Route path="/edit/:id">
          <EditMovie />
        </Route>
      </Router>
    </div>
  );
}

export default App;
