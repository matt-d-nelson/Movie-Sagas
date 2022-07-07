import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/App.js";
// Provider allows us to use redux within our react app
import { Provider } from "react-redux";
import storeInstance from "./redux/reducers/reducers.js";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: "VCR_OSD_MONO_1",
  },
  palette: {
    primary: { main: "rgb(75, 26, 61)", dark: "rgb(65, 16, 51)" },
    secondary: { main: "rgb(145, 25, 46)" },
    warning: { main: "rgb(206, 37,40)" },
    info: { main: "rgb(216, 64, 42)" },
    success: { main: "rgb(226,146,55)" },
  },
  shape: {
    borderRadius: 0,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={storeInstance}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
