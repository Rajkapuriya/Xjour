import React from "react";
import ReactDOM from "react-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "./store";

import reportWebVitals from "./reportWebVitals";

import "./index.css";

import { StateProvider } from "./config/context api/StateProvider";
import reducer, { initialState } from "./config/context api/reducer";

import App from "./App";

// import Raleway from "./assets/fonts/Raleway.ttf";
// import RalewayItalic from "./assets/fonts/Raleway-Italic.ttf";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",

  // you can also just use 'scale'
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 1500,
  },
};

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <StateProvider reducer={reducer} initialState={initialState}>
          <AlertProvider template={AlertTemplate} {...options}>
            <App />
          </AlertProvider>
        </StateProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
