import "../PublicCSS/templatestyle.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { baseURL } from "../../urlConfig.js";
import { BlogBox } from "./subcomponents/blogbox.jsx";

export function ShelterListBlog() {
    const [inputs, setInputs] = useState({
        searchBySelector: "title",
        searchContent: "",
        sortBySelector: "title",
        ascendingDescending: "",
    });
    // Call the api to list all blogs for shelter
    const [blogs, setBlogs] = useState({});
    const [next, setNext] = useState("");
    const [prev, setPrev] = useState("");
    const [isNext, setIsNext] = useState(true);
    const [isPrev, setIsPrev] = useState(false);
    var [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        getBlogs();
    }, []);

    function setStuff(response) {
        setBlogs(response.data.results);
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

    const getBlogs = async () => {
        const token = localStorage.getItem("token");
        const response = await Axios.get(
          `${baseURL}blogs/list/?ordering=` + inputs.ascendingDescending
          + inputs.sortBySelector + "&" + inputs.searchBySelector + "=" + inputs.searchContent,
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

    const getNextBlogs = async () => {
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
    
      const getPrevBlogs = async () => {
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
        for (let i = 0; i < blogs.length; i++) {
          boxes.push(<BlogBox key={blogs[i].id} {...blogs[i]} />);
        }
        return boxes;
    }

    function PageButtons() {
        const NextButton = <span className="page-button" onClick={getNextBlogs}>Next</span>
        const PrevButton = <span className="page-button" onClick={getPrevBlogs}>Prev</span>
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
        getBlogs();
    }

    const handleCreate = (event) => {
        navigate("/blog/create");
    }
    return (
        <div>
          {header()}
          {sidebar()}
          <div className="content-box">
            <div className="wrap-box">
                <button style={{marginTop:"1rem", marginBottom:"1rem"}}
                onClick={handleCreate}>
                    Create Blog
                </button>
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
                      <option value="title">Title</option> 
                      <option value="shelter_profile__name">Shelter Name</option>
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
                      <option value="title">Title</option> 
                      <option value="shelter_profile__name">Shelter Name</option>
                    </select>
                  </div>
                </div>
                
              </form>
              <div className="box-container-for-shelter-list">{createBoxes()}</div>
            </div>
            {PageButtons()}
          </div>
        </div>
    );
}