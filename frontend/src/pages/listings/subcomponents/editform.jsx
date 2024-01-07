import {useEffect, useState} from "react";
import Axios from "axios";
import {redirect, useNavigate, useParams} from "react-router-dom";
import "./listingform.css"
import { baseURL } from "../../../urlConfig";

export function form() {
  var [inputs, setInputs] = useState({"gender": "M","status":  1});
  const [error, setError] = useState(null);
  const [nameerror, setNameError] = useState(null);
  const [breederror, setBreedError] = useState(null);
  const [ageerror, setAgeError] = useState(null);
  const [gendererror, setGenderError] = useState(null);
  const [sizeerror, setSizeError] = useState(null);
  const [descriptionerror, setDescriptionError] = useState(null);
  const [statuserror, setStatusError] = useState(null);
  const [locationerror, setLocationError] = useState(null);
  const [listing, setListing] = useState({});
  const navigate = useNavigate();
    const { id } = useParams();

  useEffect(() => {
    getListing();
  }, []);

  const getListing = async () => {
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      `${baseURL}listings/listing/` + id.toString() + "/",
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
      navigate("/listing_not_found");
    } else {
      setListing(response.data);
      inputs.name = response.data.name;
      inputs.breed = response.data.breed;
      inputs.age = response.data.age;
      inputs.size = response.data.size;
      inputs.gender = response.data.gender;
      inputs.description = response.data.description;
      inputs.location = response.data.location;
      inputs.status = response.data.status;
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (event.target.name === "name") {
      if (event.target.value === "") {
        setNameError("Name must not be empty");
        return;
      }
      setNameError("");
    } else if (event.target.name === "breed") {
      if (event.target.value === "") {
        setBreedError("Breed must not be empty");
        return;
      }
      setBreedError("");
    } else if (event.target.name === "age") {
      if (event.target.value === "") {
        setAgeError("Age must not be empty");
        return;
      }
      setAgeError("");
    } else if (event.target.name === "size") {
      if (event.target.value === "") {
        setSizeError("Size must not be empty");
        return;
      }
      setSizeError("");
    } else if (event.target.name === "description") {
      if (event.target.value === "") {
        setDescriptionError("Description must not be empty");
        return;
      }
      setDescriptionError("");
    } else if (event.target.name === "location") {
      if (event.target.value === "") {
        setLocationError("Location must not be empty");
        return;
      }
      setLocationError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    var isinvalid = false;
    if (!inputs.name) {
      setNameError("Name must not be empty");
      isinvalid = true;
    } else {
      setNameError("");
    }
    if (!inputs.breed) {
      setBreedError("Breed must not be empty");
      isinvalid = true;
    } else {
      setBreedError("");
    }
    if (!inputs.age) {
      setSizeError("Size must not be empty");
      isinvalid = true;
    } else {
      setSizeError("");
    }
    if (!inputs.description) {
      setDescriptionError("Description must not be empty");
      isinvalid = true;
    } else {
      setDescriptionError("");
    }
    if (!inputs.age) {
      setAgeError("Age must not be empty");
      isinvalid = true;
    } else {
      setAgeError("");
    }
    if (!inputs.location) {
      setLocationError("Location must not be empty");
      isinvalid = true;
    } else {
      setLocationError("");
    }
    if (isinvalid) {
      return;
    }
    Axios.put(
      // TODO: CHANGE URL TO THE DJANGO URL
      `${baseURL}listings/update/` + id.toString() + "/",
        {
            name: inputs.name,
            breed: inputs.breed,
            age: inputs.age,
            gender: inputs.gender,
            size: inputs.size,
            description: inputs.description,
            status: parseInt(inputs.status, 10),
            location: inputs.location,
        },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    )
    .then(() => {
        navigate("/shelter/mylistings");
    })
    .catch((error) => {
      console.log(error);
      setError("One or more fields are invalid, please fix this issue");
      setNameError(error.response.data.name || null);
      setBreedError(error.response.data.breed || null);
      setAgeError(error.response.data.age || null);
      setGenderError(error.response.data.gender || null);
      setSizeError(error.response.data.size || null);
      setDescriptionError(error.response.data.description || null);
      setStatusError(error.response.data.status || null);
      setLocationError(error.response.data.location || null);

    });
  };

  return (
      <form onSubmit={handleSubmit}>
          <h1>Edit Listing: {inputs.name}</h1>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          className="form-control"
          required
          name="name"
          value={inputs.name || ""}
          onChange={handleChange}
        ></input>
        {nameerror && <p className="error-text">{nameerror}</p>}

        <label htmlFor="breed">Breed:</label>
        <input
          type="text"
          id="breed"
          className="form-control"
          required
          name="breed"
          value={inputs.breed || ""}
          onChange={handleChange}
        ></input>
        {breederror && <p className="error-text">{breederror}</p>}

        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          className="form-control"
          required
          name="age"
          value={inputs.age || ""}
          onChange={handleChange}
        ></input>
        {ageerror && <p className="error-text">{ageerror}</p>}

          <label htmlFor="size">Size:</label>
        <input
          type="text"
          id="size"
          className="form-control"
          required
          name="size"
          value={inputs.size || ""}
          onChange={handleChange}
        ></input>
        {sizeerror && <p className="error-text">{sizeerror}</p>}

          <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          required
          name="gender"
          value={inputs.gender || ""}
          onChange={handleChange}
        >
            <option value="M">Male</option>
            <option value="F">Female</option>
        </select>
        {gendererror && <p className="error-text">{gendererror}</p>}

          <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          className="form-control"
          required
          name="description"
          value={inputs.description || ""}
          onChange={handleChange}
        ></textarea>
        {descriptionerror && <p className="error-text">{descriptionerror}</p>}

        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          className="form-control"
          required
          name="location"
          value={inputs.location || ""}
          onChange={handleChange}
        ></input>
        {locationerror && <p className="error-text">{locationerror}</p>}


        <label htmlFor="status">Status:</label>
        <select
          id="status"
          required
          name="status"
          value={inputs.status || ""}
          onChange={handleChange}
        >
            <option value="1">Available</option>
            <option value="2">Adopted</option>
            <option value="3">Pending</option>
            <option value="4">Withdrawn</option>
        </select>
        {statuserror && <p className="error-text">{statuserror}</p>}

        {error && <p className="error-text">{error}</p>}

        <input
          type="submit"
          className="page-button"
          id="submit"
          value="Confirm"
        ></input>
      </form>
  );
}
