import React, { Component } from "react";
import axios from "axios";
import { Consumer } from "../../context";
import TextInputGroup from "../layout/TextInputGroup";

// generates ID using UUID NPM
// import uuid from "uuid";

class EditContact extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    errors: {}
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    const contact = res.data;
    this.setState({
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    });
  }

  // Update form field state value's when they type in there (without this you cannot type in the field, it will seem to ignore the input)
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Submit functionality to form's submit button
  onSubmit = async (dispatch, e) => {
    e.preventDefault();
    const { name, email, phone } = this.state;

    // Check for errors
    if (name === "") {
      this.setState({
        errors: { name: "Name is required" }
      });
      return;
    }
    if (email === "") {
      this.setState({
        errors: { email: "Valid Email is required" }
      });
      return;
    }
    if (phone === "") {
      this.setState({
        errors: { phone: "Phone number is required" }
      });
      return;
    }

    // Updated contact object
    const updContact = {
      name,
      email,
      phone
    };
    const { id } = this.props.match.params;

    // This will give us back the ID (action.payload.id) for the 'UPDATE_CONTACT' dispatch in our Context.js
    const res = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      updContact
    );
    dispatch({ type: "UPDATE_CONTACT", payload: res.data });

    // clear state
    this.setState({
      name: "",
      email: "",
      phone: "",
      errors: {}
    });

    this.props.history.push("/");
  };

  render() {
    const { name, email, phone, errors } = this.state;

    return (
      <Consumer>
        {value => {
          const { dispatch } = value;
          return (
            <div className="card mb-3">
              <div className="card-header">Edit Contact</div>
              <div className="card-body">
                <form onSubmit={this.onSubmit.bind(this, dispatch)}>
                  <TextInputGroup
                    label="name"
                    name="name"
                    placeholder="Enter Name"
                    value={name}
                    onChange={this.onChange}
                    error={errors.name}
                  />
                  <TextInputGroup
                    label="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={this.onChange}
                    error={errors.email}
                  />
                  <TextInputGroup
                    label="phone"
                    name="phone"
                    placeholder="Enter Phone"
                    value={phone}
                    onChange={this.onChange}
                    error={errors.phone}
                  />
                  <input
                    type="submit"
                    value="Update Contact"
                    className="btn btn-light btn-block"
                  />
                </form>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default EditContact;
