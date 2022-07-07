// Import saga middleware
import createSagaMiddleware from "redux-saga";
import { takeEvery, put } from "redux-saga/effects";
import axios from "axios";

// Create the rootSaga generator function
function* rootSaga() {
  yield takeEvery("FETCH_MOVIES", fetchAllMovies);
  yield takeEvery("FETCH_GENRES", fetchGenres);
  yield takeEvery("ADD_MOVIE", postMovie);
  yield takeEvery("EDIT_MOVIE", editMovie);
  yield takeEvery("DELETE_MOVIE", deleteMovie);
}

function* deleteMovie(action) {
  // DELETE request with movie id in url param
  try {
    console.log(action.payload);
    const res = yield axios({
      method: "delete",
      url: `api/movie/${action.payload}`,
    });
    console.log(res);
  } catch (err) {
    console.log(err);
    alert("error deleting movie");
  }
}

function* editMovie(action) {
  // PUT request with new movie details as form data
  try {
    const res = yield axios({
      method: "put",
      url: "/api/movie",
      data: action.payload,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
    alert("error updating movie");
  }
}

function* postMovie(action) {
  // POST request with new movie details as form data
  try {
    const res = yield axios({
      method: "post",
      url: "/api/movie",
      data: action.payload,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
    alert("error adding movie");
  }
}

function* fetchGenres(action) {
  // GET request for genres of a movie instance / id in url param
  try {
    const genres = yield axios.get(`/api/genre/${action.payload}`);
    console.log("in fetch genres", genres.data);
    yield put({ type: "SET_GENRES", payload: genres.data });
  } catch (err) {
    console.log(err);
    alert("error getting genres");
  }
}

function* fetchAllMovies() {
  // get all movies from the DB
  try {
    const movies = yield axios.get("/api/movie");
    console.log("get all:", movies.data);
    yield put({ type: "SET_MOVIES", payload: movies.data });
  } catch {
    console.log("get all error");
  }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// imported by ../reducers/reducers.js
export default [rootSaga, sagaMiddleware];
