import "../PublicCSS/templatestyle.css";
import "./shelterlist.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { ShelterBox } from "./subcomponents/shelterbox";
import { baseURL } from "../../urlConfig.js";

export function ShelterShelterList() {
  const [shelters, setShelters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkUserTypeAndNavigate();
    getShelters();
  }, []);

  const checkUserTypeAndNavigate = () => {
    if (localStorage.getItem("userType") === "1") {
      navigate("/user/list");
    }
  };

  const getShelters = async () => {
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      `${baseURL}accounts/shelter/list/`,
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
      setShelters(response.data);
    }
  };

  function createBoxes() {
    const boxes = [];
    for (let i = 0; i < shelters.length; i++) {
      boxes.push(<ShelterBox key={shelters[i].id} {...shelters[i]} />);
    }
    return boxes;
  }

  return (
    <div>
      {header()}
      {sidebar()}
      <div className="content-box">
        <div className="wrap-box">
          <div className="box-container-for-shelter-list">{createBoxes()}</div>
        </div>
      </div>
    </div>
  );
}
