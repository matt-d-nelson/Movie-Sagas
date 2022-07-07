import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";

import movieSaga from "../sagas/sagas";

// Used to store movies returned from the server
const movies = (state = [], action) => {
  switch (action.type) {
    case "SET_MOVIES":
      return action.payload;
    default:
      return state;
  }
};

// Used to store the genres of an instance of a movie
const genres = (state = [], action) => {
  switch (action.type) {
    case "SET_GENRES":
      return action.payload;
    default:
      return state;
  }
};

// Create one store that all components can use
const storeInstance = createStore(
  combineReducers({
    movies,
    genres,
  }),
  // Add sagaMiddleware to our store
  applyMiddleware(movieSaga[1], logger)
);

// Pass rootSaga into our sagaMiddleware
movieSaga[1].run(movieSaga[0]);

// imported by ../../index.js
export default storeInstance;
