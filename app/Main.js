import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

//Contexts
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

//Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("blogappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("blogappToken"),
      username: localStorage.getItem("blogappUsername"),
      avatar: localStorage.getItem("blogappAvatar"),
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        break;
      case "logout":
        draft.loggedIn = false;
        break;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("blogappToken", state.user.token);
      localStorage.setItem("blogappUsername", state.user.username);
      localStorage.setItem("blogappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("blogappToken");
      localStorage.removeItem("blogappUsername");
      localStorage.removeItem("blogappAvatar");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            {/* Dynamic routing */}
            <Route path="/post/:id">
              <ViewSinglePost />
            </Route>
            <Route path="/about-us" exact>
              <About />
            </Route>
            <Route path="/terms" exact>
              <Terms />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
