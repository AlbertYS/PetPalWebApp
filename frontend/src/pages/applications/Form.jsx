import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./application.css";
import { useParams } from "react-router-dom";
import { CommentBox } from "./subcomponents/CommentBox";
import { baseURL } from "../../urlConfig";

export function form(application=null) {
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [firstnameerror, setFirstNameError] = useState(null);
  const [lastnameerror, setLastNameError] = useState(null);
  const [addresserror, setAddressError] = useState(null);
  const [emailerror, setEmailError] = useState(null);
  const [imageerror, setImageError] = useState(null);
  const [phonenumerror, setPhoneNumError] = useState(null);
  const navigate = useNavigate();
  var [page, setPage] = useState(1);
  var [next, setNext] = useState();
  var [prev, setPrev] = useState();
  var [comments, setComments] = useState({});

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
    if (event.target.name === "first_name") {
      handleChange(event);
      if (event.target.value === "") {
        setFirstNameError("First Name must not be empty");
        return;
      }
      setFirstNameError("");
    } else if (event.target.name === "last_name") {
      handleChange(event);
      if (event.target.value === "") {
        setLastNameError("Last Name must not be empty");
        return;
      }
      setLastNameError("");
    } else if (event.target.name === "address") {
      handleChange(event);
      if (event.target.value === "") {
        setAddressError("Address must not be empty");
        return;
      }
      setAddressError("");
    } else {
      if (event.target.value === "") {
        setImageError("Proof of Identity must not be empty");
        return;
      }
      setImageError("");
    }
  }

  useEffect(() => {
    getCommentList();
  }, []);

  const getCommentList = async () => {
    if (!application) {
      return;
    }
    const token = localStorage.getItem("token");
    const response_comments = await Axios.get(
      // TODO: CHANGE URL TO THE DJANGO URL
      `${baseURL}comments/list/application/` + id.toString() + `/?ordering=-creation_time&page=` + page,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => {
      console.log(error);
    });
    if (!response_comments) {
      console.log("unauthorized");
      navigate("/application_not_found");
    } else {
      console.log(response_comments.data.results);
      setComments(response_comments.data.results);
      setPrev(response_comments.data.previous);
      setNext(response_comments.data.next);
    }
  };

  function createComments() {
    const boxes = [];
    for (let i = 0; i < comments.length; i++) {
      boxes.push(<CommentBox key={comments[i].id} {...comments[i]} />);
    }
    return boxes;
  }

  function prev_page(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (prev !== null) {
      setPage((prevPage) => prevPage - 1);
      getComments(prev, token);
    }
  }

  function next_page(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (next !== null) {
      setPage((prevPage) => prevPage + 1);
      getComments(next, token);
    }
  }

  const getComments = async (url, token) => {
    
    var response_comments_2 = await Axios.get(
      // TODO: CHANGE URL TO THE DJANGO URL
      url,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => {
      console.log(error);
    });
    if (!response_comments_2) {
      console.log("unauthorized");
      navigate("/shelter_not_found");
    } else {
      setComments(response_comments_2.data.results);
      setPrev(response_comments_2.data.previous);
      setNext(response_comments_2.data.next);
    }
  }

  const handleSubmitComment = (event) => {
    event.preventDefault();
    Axios.post(
      // TODO: CHANGE URL TO THE DJANGO URL
      `${baseURL}comments/creation/application/` + id.toString() + "/",
      {
        content: inputs.commentContent
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    ).then((response) => {
      getComments(
        `${baseURL}comments/list/application/` + id.toString() + `/?ordering=-creation_time&page=` + page,
        localStorage.getItem("token")
      );
    }).catch((error) => {
      console.log(error.response.data);
    });
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    console.log(inputs);
  };

  const handleChangeFile = (event) => {
    fieldrequired(event);
    setInputs((values) => ({ ...values, proof_of_identity: event.target.files[0] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    var isinvalid = false;
    var phoneRegex = /^\d{3}-\d{3}-\d{4}$/
    var emailRegex = /^(?!.*\.\.)[^_\s@]+@[^_\s@]+\.[^_\s@]+$/;
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
    if (!inputs.proof_of_identity) {
      setImageError("Proof of Identity must not be empty");
      isinvalid = true;
    } else {
      setImageError("");
    }
    if (!inputs.first_name) {
      setFirstNameError("Name must not be empty");
      isinvalid = true;
    } else {
      setFirstNameError("");
    }
    if (!inputs.last_name) {
      setLastNameError("Name must not be empty");
      isinvalid = true;
    } else {
      setLastNameError("");
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

    const formData = new FormData();
    formData.append('first_name', inputs.first_name);
    formData.append('last_name', inputs.last_name);
    formData.append('email', inputs.email);
    formData.append('phoneNum', inputs.phoneNum);
    formData.append('address', inputs.address);
    formData.append('proof_of_identity', inputs.proof_of_identity);

    console.log(formData);
    Axios.post(
      // TODO: CHANGE URL TO THE DJANGO URL
      `${baseURL}applications/creation/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    ).then((res) => {
      navigate("/listings")
    }).catch((error) => {
      console.log(error);
      setError("One or more fields are invalid, please fix this issue");
      setFirstNameError(error.response.data.first_name || null);
      setLastNameError(error.response.data.last_name || null);
      setAddressError(error.response.data.address || null);
      setEmailError(error.response.data.email || null);
      setImageError(error.response.data.proof_of_identity || null);
      setPhoneNumError(error.response.data.phoneNum || null);
    });
  };

  function withdrawApplication() {
    modifyApplication(4);
  }

  function acceptApplication () {
    modifyApplication(2);
  }

  function denyApplication () {
    modifyApplication(2);
  }

  const modifyApplication = async (status) => {
    const token = localStorage.getItem("token");
    var url = `${baseURL}applications/updater/${id}/`;
    Axios.put(
      url,
      {
        "status": status
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    ).then((res) => {
      navigateBack();
    }).catch((error) => {
      console.log(error);
      navigateBack();
    });

  }

  function navigateBack() {
    if (localStorage.getItem("userType") === "1") {
      navigate("/user/application/list");
    } else {
      navigate("/shelter/application/list");
    }
  }

  if (application) {
    var buttonDisable = application.status !== 1;
    if (localStorage.getItem("userType") === "1") {
      buttonDisable &&= application.status !== 2;
    }
    if (application.denied) {
      return (
        <div>
          <h1>You do not have permission to view this application.</h1>
        </div>
      )
    }
    return (
      <div>
        <div style={{ width: '100%', display: "flex", marginTop: "-5rem", marginBottom: "2rem" }}>
          <div style={{ width: '100%', display: "flex", justifyContent:"flex-end" }}>
            <button
            style={{ margin: 0, height: "auto"}}
            onClick={navigateBack}
            >Back</button>
          </div>
        </div>
        {localStorage.getItem("userType") === "2" ? (
        // Render accept and deny buttons
        <div style={{ width: '100%', display: "flex", marginBottom: "2rem" }}>
          <div style={{ width: '100%', display: "flex", justifyContent:"flex-start" }}>
            <button
              style={{ margin: 0, height: "auto"}}
              onClick={acceptApplication}
              disabled={buttonDisable}
            >Accept</button>
            <button
              style={{ margin: 0, height: "auto", marginLeft: "1rem"}}
              onClick={denyApplication}
              disabled={buttonDisable}
            >Deny</button>
          </div>
        </div>
        ) : (
        // Render withdraw button
        <div style={{ width: '100%', display: "flex", marginBottom: "2rem" }}>
          <div style={{ width: '100%', display: "flex", justifyContent:"flex-start" }}>
            <button
              style={{ margin: 0, height: "auto"}}
              onClick={withdrawApplication}
              disabled={buttonDisable}
            >Withdraw</button>
          </div>
        </div>
      )}
        <form id="accountform">
          <label htmlFor="first_name">First name:</label>
          <input
            type="text"
            id="first_name"
            className="form-control"
            name="first_name"
            disabled
            value={application.first_name}
          ></input>
  
          <label htmlFor="last_name">Last name:</label>
          <input
            type="text"
            id="last_name"
            className="form-control"
            name="last_name"
            disabled
            value={application.last_name}
          ></input>
  
          <label htmlFor="address">Address:</label>
          <input
            className="form-control"
            type="text"
            id="address"
            name="address"
            disabled
            value={application.address}
          ></input>
  
          <label htmlFor="email">Email:</label>
          <input
            className="form-control"
            type="text"
            id="email"
            name="email"
            disabled
            value={application.email}
          ></input>
  
          <label htmlFor="phoneNum">Phone number:</label>
          <input
            className="form-control"
            type="tel"
            id="phoneNum"
            name="phoneNum"
            disabled
            value={application.phoneNum}
          ></input>
  
          <label htmlFor="proof_of_identity">Proof of identity:</label>
          <div>
            <a
              href={application.proof_of_identity}
              download  // This attribute triggers the download
              target="_blank"  // Opens the link in a new tab
            >
              Download Proof of Identity
            </a>
            <br />
            <img
              src={application.proof_of_identity}
              alt="Proof of Identity"
              style={{ maxWidth: '100%', maxHeight: '400px', marginTop: '10px' }}
            />
          </div>
        </form>
        <form
          style={{display: 'flex', alignItems: 'center'}}
          onSubmit={handleSubmitComment}
        >
          <input
            type="text"
            id="commentContent"
            name="commentContent"
            className="form-control"
            onChange={handleChange}
            style={{margin:0, flex: 1}}
          ></input>
          <input
            style={{margin:0}}
            type="submit"
            className="page-button"
            id="submit"
            value="Comment"
           />
        </form>
        {createComments()}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button style={{ margin: 0 }}
            type='button'
            onClick={(event) => prev_page(event)}
          >Previous</button>
          <p style={{ flex: 1, textAlign: 'center' }}>Page {page}</p>
          <button style={{ margin: 0 }}
            onClick={(event) => next_page(event)}
            type='button'
          >Next</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form id="accountform" onSubmit={handleSubmit}>
        <label htmlFor="first_name">First name:</label>
        <input
          type="text"
          id="first_name"
          className="form-control"
          name="first_name"
          required
          onChange={fieldrequired}
        ></input>
        {firstnameerror && <p className="error-text">{firstnameerror}</p>}

        <label htmlFor="last_name">Last name:</label>
        <input
          type="text"
          id="last_name"
          className="form-control"
          name="last_name"
          required
          onChange={fieldrequired}
        ></input>
        {lastnameerror && <p className="error-text">{lastnameerror}</p>}

        <label htmlFor="address">Address:</label>
        <input
          className="form-control"
          type="text"
          id="address"
          name="address"
          required
          onChange={fieldrequired}
        ></input>
        {addresserror && <p className="error-text">{addresserror}</p>}

        <label htmlFor="email">Email:</label>
        <input
          className="form-control"
          type="text"
          id="email"
          name="email"
          required
          onChange={validateEmail}
        ></input>
        {emailerror && <p className="error-text">{emailerror}</p>}

        <label htmlFor="phoneNum">Phone number:</label>
        <input
          className="form-control"
          type="tel"
          id="phoneNum"
          name="phoneNum"
          required
          onChange={validatePhone}
        ></input>
        {phonenumerror && <p className="error-text">{phonenumerror}</p>}

        <label htmlFor="proof_of_identity">Proof of identity:</label>
        <input
          type="file"
          id="proof_of_identity"
          name="proof_of_identity"
          required
          onChange={handleChangeFile}
        ></input>
        {imageerror && <p className="error-text">{imageerror}</p>}

        {error && <p className="error-text">{error}</p>}

        <button
          className="page-button"
          type="submit"
          id="submitButton"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
