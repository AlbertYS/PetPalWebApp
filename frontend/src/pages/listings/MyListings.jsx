import "../PublicCSS/templatestyle.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { ListingBox } from "./subcomponents/listingbox";
import { baseURL } from "../../urlConfig.js";

export function MyListings() {
  const [inputs, setInputs] = useState({
    searchBySelector: "breed",
    searchContent: "",
    sortBySelector: "name",
    ascendingDescending: "",
  });
  const [listings, setListings] = useState({});
  const [next, setNext] = useState("");
  const [prev, setPrev] = useState("");
  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(false);
  var [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [shelterName, setShelterName] = useState();

  useEffect(() => {
    getProfile();
    checkUserTypeAndNavigate();
  }, []);

  const checkUserTypeAndNavigate = () => {
    if (localStorage.getItem("userType") === "1") {
      navigate("/user/application/list");
    }
  };

  // get user's profile name
  function getProfile() {
    const token = localStorage.getItem("token");
    const response = Axios.get(
      `${baseURL}accounts/shelter/profile/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).then((response) => {
      console.log(response);
    if (!response) {
      console.log("unauthorized");
      navigate("/login");
    } else {
      getListings(response.data.profile.name);
      setShelterName(response.data.profile.name);
    }
    })
        .catch((error) => console.log(error));

  };

  function setStuff(response) {
    setListings(response.data.results);
    if (!response.data.next) {
      setIsNext(false);
    } else {
      setIsNext(true);
      setNext(response.data.next);
    }
    if (!response.data.previous) {
      setIsPrev(false);
    } else {
      setIsPrev(true);
      setPrev(response.data.previous);
    }
    console.log(listings);
  }

  function getListings(name) {
    const token = localStorage.getItem("token");
    var searchContent = inputs.searchContent;
    if (inputs.searchBySelector === 'status') {
      searchContent = mapStatus(searchContent);
    }
    const response =  Axios.get(
      `${baseURL}listings/list/?ordering=` + inputs.ascendingDescending
      + inputs.sortBySelector + "&" + inputs.searchBySelector + "=" + searchContent + "&shelter_profile__name="
        + name,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).then((response) => {
        console.log(response);
        if (!response) {
          console.log("unauthorized");
          navigate("/login");
        } else {
          setStuff(response);
        }
    })
        .catch((error) => console.log(error));

  }

  const getNextListings = async () => {
    if (!isNext) {
      return null;
    }
    setPage((prevPage) => prevPage + 1);
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      next,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => console.log(error));
    if (!response) {
      console.log("unauthorized");
      navigate("/login");
    } else {
      setStuff(response);
    }
  };

  const getPrevListings = async () => {
    if (!isPrev) {
      return null;
    }
    setPage((prevPage) => prevPage - 1);
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      prev,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => console.log(error));
    if (!response) {
      console.log("unauthorized");
      navigate("/login");
    } else {
      setStuff(response);
    }
  };

  function createBoxes() {
    const boxes = [];
    for (let i = 0; i < listings.length; i++) {
      boxes.push(<ListingBox key={listings[i].id} {...listings[i]} />);
    }
    return boxes;
  }
  
  function navigateCreateListing() {
    navigate("/listings/create");
  }

  function PageButtons() {
    const NextButton = <span className="page-button" onClick={getNextListings}>Next</span>
    const PrevButton = <span className="page-button" onClick={getPrevListings}>Prev</span>
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {PrevButton}
          <p style={{ flex: 1, textAlign: 'center' }}> Page {page} </p>
          {NextButton}
        </div>);

  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    getListings(shelterName);
  }

  function mapStatus(status) {
    const normalizedStatus = status.trim().toLowerCase();
  
    switch (normalizedStatus) {
      case "available":
        return 1;
      case "adopted":
        return 2;
      case "pending":
        return 3;
      case "withdrawn":
        return 4;
      default:
        return "";
    }
  }

  return (
    <div>
      {header()}
      {sidebar()}
      <div className="content-box">
        <div className="wrap-box">
          <form
            style={{width: '100%'}}
            onSubmit={handleSubmit}
          >
            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
              <input
                type="text"
                id="searchContent"
                name="searchContent"
                className="form-control"
                onChange={handleChange}
                style={{margin:0, flex: 1}}
              ></input>
              <input
                style={{margin:0}}
                type="submit"
                className="page-button"
                id="submit"
                value="Search"
              />
            </div>
            <div className="wrap-box">
              <div className="component-box">
                <label htmlFor="sortBySelector" style={{margin:"5px"}}>
                  Sort By
                </label>
                <select
                  id="sortBySelector"
                  name="sortBySelector"
                  onChange={handleChange}
                  style={{margin:"5px"}}
                >
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                </select>
                <select
                  id="ascendingDescending"
                  name="ascendingDescending"
                  onChange={handleChange}
                  style={{margin:"5px"}}
                >
                  <option value="">Ascending</option>
                  <option value="-">Descending</option>
                </select>
              </div>
              <div className="component-box">
                <label htmlFor="searchBySelector" style={{margin:"5px"}}>
                  Search By
                </label>
                <select
                  id="searchBySelector"
                  name="searchBySelector"
                  onChange={handleChange}
                  style={{margin:"5px"}}
                >
                  <option value="breed">Breed</option>
                  <option value="status">Status</option>
                  <option value="age">Age</option>
                </select>
              </div>
            </div>

          </form>
          <div className="component-box">
            <button className="page-button" onClick={navigateCreateListing}>New listing</button>
          </div>
          <div className="box-container-for-shelter-list">{createBoxes()}</div>
        </div>
        {PageButtons()}
      </div>
    </div>
  );
}
