import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../account.css";
import { baseURL } from "../../../urlConfig";

export function profileform() {
  const [inputs, setInputs] = useState({});
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [password1error, setPassword1Error] = useState(null);
  const [password2error, setPassword2Error] = useState(null);
  const [addresserror, setAddressError] = useState(null);
  const [emailerror, setEmailError] = useState(null);
  const [imageerror, setImageError] = useState(null);
  const [nameerror, setNameError] = useState(null);
  const [phonenumerror, setPhoneNumError] = useState(null);
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);

  function validatePassword1(event) {
    handleChange(event);
    var password = event.target;
    // Check validity of password
    var lowercaseRegex = /[a-z]/;
    var uppercaseRegex = /[A-Z]/;
    var digitRegex = /\d/;
    var specialCharRegex = /[!@#$%^&*]/;

    if (password.value === "") {
      setPassword1Error("");
        return true;
    }

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
    if (email.value.length === 0 || regex.test(email.value)) {
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
      if (phone.value.length === 0 || regex.test(phone.value)) {
          setPhoneNumError("");
          return true;
      }
      setPhoneNumError("Phone number is invalid");
      return false;
  }

  function fieldrequired(event) {
    if (event.target.name === "name") {
      handleChange(event);
      if (event.target.value === "") {
        setNameError("Name must not be empty");
        return;
      }
      setNameError("");
    } else if (event.target.name === "address") {
      handleChange(event);
      if (event.target.value === "") {
        setAddressError("Address must not be empty");
        return;
      }
      setAddressError("");
    } else {
      if (event.target.value === "") {
        setImageError("User profile must not be empty");
        return;
      }
      setImageError("");
    }
  }

  useEffect(() => {
    if (inputs.profilePic) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(inputs.profilePic);
    } else {
      getProfile();
    }
  }, [inputs.profilePic]);

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      `${baseURL}accounts/user/profile/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => console.log(error));
    console.log(response);
    if (!response) {
      console.log("unauthorized");
      navigate("/login");
    } else {
      setProfile(response.data.profile);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChangeFile = (event) => {
    fieldrequired(event);
    setInputs((values) => ({ ...values, profilePic: event.target.files[0] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    var isinvalid = false;
    var lowercaseRegex = /[a-z]/;
    var uppercaseRegex = /[A-Z]/;
    var digitRegex = /\d/;
    var specialCharRegex = /[!@#$%^&*]/;
    var phoneRegex = /^\d{3}-\d{3}-\d{4}$/
    var emailRegex = /^(?!.*\.\.)[^_\s@]+@[^_\s@]+\.[^_\s@]+$/;
    // Check all inputs:
    if (!inputs.password) {
      setPassword1Error("");
    }else if (!
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
    if (!inputs.password && !inputs.repeat_password) {
      setPassword2Error("");
    } else if (inputs.password !== inputs.repeat_password) {
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
    if (!phoneRegex.test(inputs.phone)) {
      setPhoneNumError("Phone number is invalid");
      isinvalid = true;
    } else {
      setPhoneNumError("");
    }
    if (!inputs.profilePic) {
      setImageError("User profile must not be empty");
      isinvalid = true;
    } else {
      setImageError("");
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
    if (inputs.password) {
      formData.append('password', inputs.password);
    }
    if (inputs.repeat_password) {
      formData.append('repeat_password', inputs.repeat_password);
    }

    // Append user profile fields to a nested object
    formData.append('userProfile.name', inputs.name);
    formData.append('userProfile.email', inputs.email);
    formData.append('userProfile.phoneNum', inputs.phone);
    formData.append('userProfile.address', inputs.address);
    if (inputs.preference) {
      formData.append('userProfile.preference', inputs.preference);
    }
    if (inputs.profilePic) {
      formData.append('userProfile.profilePic', inputs.profilePic);
    }
    Axios.put(
      `${baseURL}accounts/user/update/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    ).then((res) => {
      console.log(res);
      toggleEdit();
      getProfile();
    }).catch((error) => {
      console.log(error);
      setError("One or more fields are invalid, please fix this issue");
      setPassword1Error(error.response.data.password || null);
      setPassword2Error(error.response.data.repeat_password || null);
      if (error.response.data.userProfile) {
          setAddressError(error.response.data.userProfile.address || null);
          setEmailError(error.response.data.userProfile.email || null);
          setImageError(error.response.data.userProfile.profilePic || null);
          setNameError(error.response.data.userProfile.name || null);
          setPhoneNumError(error.response.data.userProfile.phoneNum || null);
      }

      if (error.response.data && error.response.data.non_field_errors) {
          setPassword1Error(error.response.data.non_field_errors[0]);
      } else {
          setPassword1Error(null);
      }
    });
    getProfile();
    //Update placeholder text for fields here?
    
  };

  function toggleEdit() {
    const password = document.getElementById("password");
    const repeat_password = document.getElementById("repeat_password");
    const name = document.getElementById("name");
    const address = document.getElementById("address");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const profilePic = document.getElementById("profilePic");
    const preference = document.getElementById("preference");
    const submitButton = document.getElementById("submitButton");
    const editButton = document.getElementById("editButton");

    if (name.hasAttribute("disabled")) {
      password.removeAttribute("disabled");
      repeat_password.removeAttribute("disabled");
      name.removeAttribute("disabled");
      address.removeAttribute("disabled");
      email.removeAttribute("disabled");
      phone.removeAttribute("disabled");
      profilePic.removeAttribute("disabled");
      submitButton.removeAttribute("disabled");
      preference.removeAttribute("disabled");
      editButton.innerHTML = "Cancel";
      name.value = profile.name;
      address.value = profile.address;
      email.value = profile.email;
      phone.value = profile.phoneNum;
      preference.value = profile.preference || "";
      name.placeholder = "";
      address.placeholder = "";
      email.placeholder = "";
      phone.placeholder = "";
      preference.placeholder = "";
      inputs.name = profile.name;
      inputs.address = profile.address;
      inputs.email = profile.email;
      inputs.phone = profile.phoneNum;
      inputs.profilePic = null;
      inputs.preference = profile.preference || "";
    } else {
      password.setAttribute("disabled", "disabled");
      repeat_password.setAttribute("disabled", "disabled");
      name.setAttribute("disabled", "disabled");
      address.setAttribute("disabled", "disabled");
      email.setAttribute("disabled", "disabled");
      phone.setAttribute("disabled", "disabled");
      profilePic.setAttribute("disabled", "disabled");
      preference.setAttribute("disabled", "disabled");
      submitButton.setAttribute("disabled", "disabled");
      password.value = "";
      repeat_password.value = "";
      name.value = "";
      address.value = "";
      email.value = "";
      phone.value = "";
      profilePic.value = "";
      preference.value = "";
      editButton.innerHTML = "Edit";
      name.placeholder = profile.name;
      address.placeholder = profile.address;
      email.placeholder = profile.email;
      phone.placeholder = profile.phoneNum;
      preference.placeholder = profile.preference || "";
      setError(null);
      setPassword1Error(null);
      setPassword2Error(null);
      setNameError(null);
      setAddressError(null);
      setEmailError(null);
      setPhoneNumError(null);
      setImageError(null);
      setImageSrc(null);
    }
  }

  return (
    <div>
      <form id="accountform" onSubmit={handleSubmit}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className="form-control"
          name="password"
          disabled
          onChange={validatePassword1}
        ></input>
        {password1error && <p className="error-text">{password1error}</p>}

        <label htmlFor="confirmpassword">Confirm password:</label>
        <input
          type="password"
          id="repeat_password"
          className="form-control"
          name="repeat_password"
          disabled
          onChange={validatePassword2}
        ></input>
        {password2error && <p className="error-text">{password2error}</p>}

        <label htmlFor="name">Shelter name:</label>
        <input
          className="form-control"
          type="text"
          id="name"
          name="name"
          disabled
          required
          placeholder={profile.name}
          onChange={fieldrequired}
        ></input>
        {nameerror && <p className="error-text">{nameerror}</p>}

        <label htmlFor="address">Address:</label>
        <input
          className="form-control"
          type="text"
          id="address"
          name="address"
          disabled
          required
          placeholder={profile.address}
          onChange={fieldrequired}
        ></input>
        {addresserror && <p className="error-text">{addresserror}</p>}

        <label htmlFor="email">Email:</label>
        <input
          className="form-control"
          type="text"
          id="email"
          name="email"
          disabled
          required
          placeholder={profile.email}
          onChange={validateEmail}
        ></input>
        {emailerror && <p className="error-text">{emailerror}</p>}

        <label htmlFor="phone">Phone number:</label>
        <input
          className="form-control"
          type="tel"
          id="phone"
          name="phone"
          placeholder={profile.phoneNum}
          disabled
          required
          onChange={validatePhone}
        ></input>
        {phonenumerror && <p className="error-text">{phonenumerror}</p>}

        <label htmlFor="profilePic">Upload a picture:</label>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          disabled
          onChange={handleChangeFile}
        ></input>
        <img
          src={imageSrc || profile.profilePic}
          alt="Proof of Identity"
          style={{ maxWidth: '100%', maxHeight: '400px', marginTop: '10px' }}
        />
        {imageerror && <p className="error-text">{imageerror}</p>}

        <label htmlFor="preference">Prefered breed:</label>
        <input
          className="form-control"
          type="text"
          id="preference"
          name="preference"
          placeholder={profile.preference}
          disabled
          required
          onChange={handleChange}
        ></input>

        {error && <p className="error-text">{error}</p>}

        <button
          className="page-button"
          type="button"
          id="editButton"
          onClick={toggleEdit}
        >
          Edit
        </button>

        <button
          className="page-button"
          type="submit"
          id="submitButton"
          disabled
        >
          Submit
        </button>
      </form>
    </div>
  );
}
