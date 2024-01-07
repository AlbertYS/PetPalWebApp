import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotifBox } from "./notifbox";
import "./notif.css"
import { baseURL } from "../../../urlConfig";

export function NotifDropdown() {
  const [inputs, setInputs] = useState({
    filterContent: "",
    sortBySelector: "creation_time",
    ascendingDescending: "",
  });
  const [notifs, setNotifs] = useState({});
  const [next, setNext] = useState("");
  const [prev, setPrev] = useState("");
  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(false);
  var [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [detailsClosed, setDetailsClosed] = useState(true);

  const handleToggleDetails = () => {
    const detailsElement = document.getElementsByClassName("left-dropdown")[0];
    if (detailsElement) {
      if (detailsElement.open) {
        setDetailsClosed(true);
      } else {
        setDetailsClosed(false);
      }
    }
  };

  useEffect(() => {
    getNotifs();
  }, []);

  function setStuff(response) {
    setNotifs(response.data.results);
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

  const getNotifs = async(updatedValues = null) => {
    const token = localStorage.getItem("token");

    var url = `${baseURL}notifications/notifications/?ordering=` + inputs.ascendingDescending
    + inputs.sortBySelector + "&status=" + inputs.filterContent;
    if (updatedValues) {
        url = `${baseURL}notifications/notifications/?ordering=` + updatedValues.ascendingDescending
        + updatedValues.sortBySelector + "&status=" + updatedValues.filterContent;
    }

    const response = await Axios.get(
      //`${baseURL}notifications/notifications/`,
      url,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).then((response) => {
        if (!response) {
          console.log("unauthorized");
          navigate("/login");
        } else {
          setStuff(response);
        }
    })
        .catch((error) => console.log(error));

  }

  const getNextNotifs = async () => {
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

  const getPrevNotifs = async () => {
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
    for (let i = 0; i < notifs.length; i++) {
      boxes.push(<NotifBox key={notifs[i].pk} {...notifs[i]} />);
    }
    return boxes;
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => {
        const updatedValues = { ...values, [name]: value };

        getNotifs(updatedValues);
        setPage(1);
        return updatedValues;
    });
  };

  function PageButtons() {
    const NextButton = <span className="page-button" onClick={getNextNotifs}>Next</span>
    const PrevButton = <span className="page-button" onClick={getPrevNotifs}>Prev</span>
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {PrevButton}
          <p style={{ flex: 1, textAlign: 'center' }}> Page {page} </p>
          {NextButton}
        </div>);

  }

  return (
      <details className={`left-dropdown ${detailsClosed ? 'closed' : ''}`}>
        <summary>
          <b className="dropdown-tag" onClick={handleToggleDetails}>Notifications</b>
        </summary>
        <div className="notif-spacer"></div>
        <div className="notif-holder">{createBoxes()}</div>
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
                  <option value="creation_time">Creation time</option> 
                  <option value="last_modified">Last modified</option>
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
                <label htmlFor="filterContent" style={{margin:"5px"}}>
                  Filter by
                </label>
                <select
                  id="filterContent"
                  name="filterContent"
                  onChange={handleChange}
                  style={{margin:"5px"}}
                >
                  <option value="">Any</option> 
                  <option value="1">read</option>
                  <option value="2">unread</option>
                </select>
              </div>
        {PageButtons()}
      </details>
  );
}
