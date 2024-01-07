import "../PublicCSS/templatestyle.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { ApplicationBox } from "./subcomponents/applicationbox";
import { baseURL } from "../../urlConfig.js";

export function ShelterApplicationList() {
  const [inputs, setInputs] = useState({
    searchContent: "",
    sortBySelector: "creation_time",
    ascendingDescending: "",
    searchBySelector: "status"
  });
  const [applications, setApplications] = useState({});
  const [next, setNext] = useState("");
  const [prev, setPrev] = useState("");
  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(false);
  var [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getApplications();
    checkUserTypeAndNavigate();
  }, []);

  const checkUserTypeAndNavigate = () => {
    if (localStorage.getItem("userType") === "1") {
      navigate("/user/application/list");
    }
  };

  function setStuff(response) {
    setApplications(response.data.results);
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
  }

  const getApplications = async () => {
    const token = localStorage.getItem("token");
    var searchContent = inputs.searchContent;
    if (inputs.searchBySelector === "status") {
      searchContent = mapStatus(searchContent);
    }
    var url = `${baseURL}applications/list/?ordering=` + inputs.ascendingDescending
    + inputs.sortBySelector + "&" + inputs.searchBySelector + "=" + searchContent;
    const response = await Axios.get(
      // TODO: CHANGE URL TO THE DJANGO URL
      url,
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
      setStuff(response);
    }
  };

  const getNextApplications = async () => {
    if (!isNext) {
      return null;
    }
    setPage((prevPage) => prevPage + 1);
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      // TODO: CHANGE URL TO THE DJANGO URL
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

  const getPrevApplications = async () => {
    if (!isPrev) {
      return null;
    }
    setPage((prevPage) => prevPage - 1);
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      // TODO: CHANGE URL TO THE DJANGO URL
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
    console.log(applications);
    for (let i = 0; i < applications.length; i++) {
      boxes.push(<ApplicationBox key={applications[i].id} {...applications[i]} />);
    }
    return boxes;
  }


  function PageButtons() {
    const NextButton = <span className="page-button" onClick={getNextApplications}>Next</span>
    const PrevButton = <span className="page-button" onClick={getPrevApplications}>Prev</span>
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
    setInputs((values) => {
      const updatedValues = { ...values, [name]: value };

      // getApplications(updatedValues);
      setPage(1);
      return updatedValues;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    getApplications();
  }

  function mapStatus(status) {
    const normalizedStatus = status.trim().toLowerCase();
  
    switch (normalizedStatus) {
      case "pending":
        return 1;
      case "accepted":
        return 2;
      case "denied":
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
        <div className="wrap-box"><form
          style={{ width: '100%' }}
          onSubmit={handleSubmit}
        >
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <input
              type="text"
              id="searchContent"
              name="searchContent"
              className="form-control"
              onChange={handleChange}
              style={{ margin: 0, flex: 1 }}
            ></input>
            <input
              style={{ margin: 0 }}
              type="submit"
              className="page-button"
              id="submit"
              value="Search"
            />
          </div>
          <div className="wrap-box">
            <div className="component-box">
              <label htmlFor="sortBySelector" style={{ margin: "5px" }}>
                Sort By
              </label>
              <select
                id="sortBySelector"
                name="sortBySelector"
                onChange={handleChange}
                style={{ margin: "5px" }}
              >
                <option value="creation_time">Creation time</option>
                <option value="last_modified">Last modified</option>
              </select>
              <select
                id="ascendingDescending"
                name="ascendingDescending"
                onChange={handleChange}
                style={{ margin: "5px" }}
              >
                <option value="">Ascending</option>
                <option value="-">Descending</option>
              </select>
            </div>
            <div className="component-box">
              <label htmlFor="searchBySelector" style={{ margin: "5px" }}>
                Search By
              </label>
              <select
                id="searchBySelector"
                name="searchBySelector"
                onChange={handleChange}
                style={{ margin: "5px" }}
              >
                <option value="status">Status</option>
                <option value="listing__name">Listing name</option>
                <option value="first_name">Applicant first name</option>
                <option value="last_name">Applicant fast name</option>
              </select>
            </div>
          </div>

        </form>
        </div>
        <div className="box-container-for-shelter-list">{createBoxes()}</div>
        {PageButtons()}
      </div>
    </div>
  );
}
