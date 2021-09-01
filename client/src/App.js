import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import { Provider } from "react-redux";
import jwt_decoder from "jwt-decode";
import setAuthToken from "./utilities/setAuthToken";
import { SET_CURRENT_USER } from "./actions/types";
import { setCurrentUser } from "./actions/authActions";
import Dashboard from "./components/dashboard/Dashboard";

//Check For Token

if (localStorage.jwtToken) {
  // Set ath Token header auth
  setAuthToken(localStorage.jwtToken);
  //Decode token and get user infonand exp

  const decoded = jwt_decoder(localStorage.jwtToken);

  //set user and isAuthenticated

  store.dispatch(setCurrentUser(decoded));
}

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/dashboard" component={Dashboard} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
