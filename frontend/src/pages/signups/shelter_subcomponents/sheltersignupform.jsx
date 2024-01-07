import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../urlConfig";

export function form() {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);
  const [usernameerror, setUsernameError] = useState(null);
  const [password1error, setPassword1Error] = useState(null);
  const [password2error, setPassword2Error] = useState(null);
  const [addresserror, setAddressError] = useState(null);
  const [emailerror, setEmailError] = useState(null);
  const [missionstatementerror, setMissionStatementError] = useState(null);
  const [nameerror, setNameError] = useState(null);
  const [phonenumerror, setPhoneNumError] = useState(null);
  const navigate = useNavigate();

  function validateUsername(event) {
    handleChange(event);
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    if (event.target.value === "") {
      setUsernameError("Username must not be empty");
      return false;
    }else if (!usernamePattern.test(event.target.value)) {
      setUsernameError("Username can only be letters and numbers");
      return false;
    }
    setUsernameError("");
    return true;
  }

  function validatePassword1(event) {
    handleChange(event);
    var password = event.target;
    // Check validity of password
    var lowercaseRegex = /[a-z]/;
    var uppercaseRegex = /[A-Z]/;
    var digitRegex = /\d/;
    var specialCharRegex = /[!@#$%^&*]/;

    // Check password2 match;
    if (password.value !== inputs.repeat_password) {
      setPassword2Error("Passwords don't match");
    } else {
      setPassword2Error("");
    }
    if (
        lowercaseRegex.test(password.value) &&
        uppercaseRegex.test(password.value) &&
        digitRegex.test(password.value) &&
        specialCharRegex.test(password.value) &&
        password.value.length >= 8
    ) {
      setPassword1Error("");
        return true;
    }
    setPassword1Error("Password must contain upper and lower case letter, number, special character and be 8 or more characters");
    return false;
  }

  function validatePassword2(event) {
    handleChange(event);
    var password2 = event.target;
    console.log(inputs);

    if (password2.value !== inputs.password) {
      setPassword2Error("Passwords don't match");
      return false;
    }
    setPassword2Error("");
    return true;
  }

  function validateEmail(event) {
    handleChange(event);
    var email = event.target;
    var regex = /^(?!.*\.\.)[^_\s@]+@[^_\s@]+\.[^_\s@]+$/;
    if (regex.test(email.value)) {
        setEmailError("");
        return true;
    }
    setEmailError("Email is invalid");
    return false;
  }

  function validatePhone(event) {
      handleChange(event);
      var phone = event.target;
      var regex = /^\d{3}-\d{3}-\d{4}$/
      if (regex.test(phone.value)) {
          setPhoneNumError("");
          return true;
      }
      setPhoneNumError("Phone number is invalid");
      return false;
  }

  function fieldrequired(event) {
    handleChange(event);
    if (event.target.name === "name") {
      if (event.target.value === "") {
        setNameError("Name must not be empty");
        return;
      }
      setNameError("");
    } else if (event.target.name === "address") {
      if (event.target.value === "") {
        setAddressError("Address must not be empty");
        return;
      }
      setAddressError("");
    } else {
      if (event.target.value === "") {
        setMissionStatementError("Mission statement must not be empty");
        return;
      }
      setMissionStatementError("");
    }
  }

  function success() {
    navigate("/login");
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var isinvalid = false;
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    var lowercaseRegex = /[a-z]/;
    var uppercaseRegex = /[A-Z]/;
    var digitRegex = /\d/;
    var specialCharRegex = /[!@#$%^&*]/;
    var phoneRegex = /^\d{3}-\d{3}-\d{4}$/
    var emailRegex = /^(?!.*\.\.)[^_\s@]+@[^_\s@]+\.[^_\s@]+$/;
    // Check all inputs:
    if (!inputs.username) {
      setUsernameError("Username must not be empty");
      isinvalid = true;
    } else if (!usernamePattern.test(inputs.username)) {
      setUsernameError("Username can only be letters and numbers");
      isinvalid = true;
    } else {
      setUsernameError("");
    }
    if (!
      (lowercaseRegex.test(inputs.password) &&
      uppercaseRegex.test(inputs.password) &&
      digitRegex.test(inputs.password) &&
      specialCharRegex.test(inputs.password) &&
      inputs.password.length >= 8)
    ) {
      setPassword1Error("Password must contain upper and lower case letter, number, special character and be 8 or more characters");
      isinvalid = true;
    } else {
      setPassword1Error("");
    }
    if (inputs.password !== inputs.repeat_password) {
      setPassword2Error("Passwords don't match");
      isinvalid = true;
    } else {
      setPassword2Error("");
    }
    if (!emailRegex.test(inputs.email)) {
      setEmailError("Email is invalid");
      isinvalid = true;
    } else {
      setEmailError("");
    }
    if (!phoneRegex.test(inputs.phoneNum)) {
      setPhoneNumError("Phone number is invalid");
      isinvalid = true;
    } else {
      setPhoneNumError("");
    }
    if (!inputs.mission_statement) {
      setMissionStatementError("Mission statement must not be empty");
      isinvalid = true;
    } else {
      setMissionStatementError("");
    }
    if (!inputs.name) {
      setNameError("Name must not be empty");
      isinvalid = true;
    } else {
      setNameError("");
    }
    if (!inputs.address) {
      setAddressError("Address must not be empty");
      isinvalid = true;
    } else {
      setAddressError("");
    }
    if (isinvalid) {
      return;
    }

    Axios.post(
      `${baseURL}accounts/shelter/registration/`,
      {
        username: inputs.username,
        password: inputs.password,
        repeat_password: inputs.repeat_password,
        shelterProfile: {
          name: inputs.name,
          email: inputs.email,
          phoneNum: inputs.phoneNum,
          address: inputs.address,
          mission_statement: inputs.mission_statement,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT",
        },
      },
    ).then((response) => {
      success();
    }).catch((error) => {
      console.log(error.response.data);
      setError("One or more fields are invalid, please fix this issue");
      setUsernameError(error.response.data.username || null);
      setPassword1Error(error.response.data.password || null);
      setPassword2Error(error.response.data.repeat_password || null);
      if (error.response.data.shelterProfile) {
          setAddressError(error.response.data.shelterProfile.address || null);
          setEmailError(error.response.data.shelterProfile.email || null);
          setMissionStatementError(error.response.data.shelterProfile.mission_statement || null);
          setNameError(error.response.data.shelterProfile.name || null);
          setPhoneNumError(error.response.data.shelterProfile.phoneNum || null);
      }

      if (error.response.data && error.response.data.non_field_errors) {
          setPassword1Error(error.response.data.non_field_errors[0]);
      } else {
          setPassword1Error(null);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        className="form-control"
        required
        name="username"
        value={inputs.username || ""}
        onChange={validateUsername}
      ></input>
        {usernameerror && <p className="error-text">{usernameerror}</p>}

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        className="form-control"
        required
        name="password"
        value={inputs.password || ""}
        onChange={validatePassword1}
      ></input>
        {password1error && <p className="error-text">{password1error}</p>}

      <label htmlFor="confirmpassword">Confirm password:</label>
      <input
        type="password"
        id="confirmpassword"
        className="form-control"
        required
        name="repeat_password"
        value={inputs.repeat_password || ""}
        onChange={validatePassword2}
      ></input>
        {password2error && <p className="error-text">{password2error}</p>}

      <h1>Tell us about your shelter:</h1>

      <label htmlFor="sheltername">Shelter name:</label>
      <input
        type="text"
        id="sheltername"
        className="form-control"
        required
        name="name"
        value={inputs.name || ""}
        onChange={fieldrequired}
      ></input>
        {nameerror && <p className="error-text">{nameerror}</p>}

      <label htmlFor="address">Address:</label>
      <input
        type="text"
        id="address"
        className="form-control"
        required
        name="address"
        value={inputs.address || ""}
        onChange={fieldrequired}
      ></input>
        {addresserror && <p className="error-text">{addresserror}</p>}

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        className="form-control"
        required
        name="email"
        value={inputs.email || ""}
        onChange={validateEmail}
      ></input>
        {emailerror && <p className="error-text">{emailerror}</p>}

      <label htmlFor="phonenumber">Phone number:</label>
      <input
        type="tel"
        id="phonenumber"
        className="form-control"
        required
        name="phoneNum"
        value={inputs.phoneNum || ""}
        onChange={validatePhone}
      ></input>
        {phonenumerror && <p className="error-text">{phonenumerror}</p>}

      <label htmlFor="missionstatement">Mission statement:</label>
      <textarea
        id="missionstatement"
        className="form-control"
        rows="5"
        required
        name="mission_statement"
        value={inputs.mission_statement || ""}
        onChange={fieldrequired}
      ></textarea>
        {missionstatementerror && <p className="error-text">{missionstatementerror}</p>}

        {error && <p className="error-text">{error}</p>}

      <input
        type="submit"
        className="page-button"
        id="submit"
        value="Create Account"
      ></input>
    </form>
  );
}
