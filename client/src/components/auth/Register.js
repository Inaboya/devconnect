import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

export class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  /* UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      console.log(nextProps.errors);
      this.setState({ errors: nextProps.errors });
    }
  }


  */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };

    this.props.registerUser(newUser, this.props.history);
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextFieldGroup
                    placeholder="FirstName || LastName"
                    value={this.state.email}
                    name="name"
                    type="text"
                    error={errors.name}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    placeholder="Email Address"
                    value={this.state.email}
                    name="email"
                    type="email"
                    error={errors.email}
                    onChange={this.onChange}
                    info="This site uses Gravatar so if you want a profile image, use
                    a Gravatar email"
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    placeholder="Password"
                    value={this.state.password}
                    name="password"
                    type="password"
                    error={errors.password}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    placeholder="Confirm Password"
                    value={this.state.password2}
                    name="password2"
                    type="password"
                    error={errors.password2}
                    onChange={this.onChange}
                  />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
