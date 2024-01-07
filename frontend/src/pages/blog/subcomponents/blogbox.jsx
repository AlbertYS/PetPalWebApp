import "./blogbox.css";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../urlConfig";
import { useEffect, useState } from "react";
import Axios from "axios";

export function BlogBox(blogInfo) {
    const navigate = useNavigate();
    const [shelterInfo, setShelterInfo] = useState(null);

    const handleClick = () => {
        if (localStorage.getItem("userType") === "1") {
            navigate("/user/blog/" + blogInfo.id);
        } else {
            navigate("/shelter/blog/" + blogInfo.id);
        }
    };
    const getShelter = async () => {
        try {
          const response = await Axios.get(`${baseURL}accounts/shelter/shelter/${blogInfo.shelter_profile}/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          setShelterInfo(response.data);
        } catch (error) {
          console.error("Error fetching shelter information:", error);
        }
    };
    
    useEffect(() => {
        if (blogInfo.shelter_profile) {
            getShelter(blogInfo.shelter_profile);
        }
    }, [blogInfo.shelter_profile]);

    return (
        <a onClick={handleClick}>
        <div className="box">
            <h1>{blogInfo.title}</h1>
            <p>By: {shelterInfo ? shelterInfo.name : "Loading..."}</p>
        </div>
        </a>
    );
}
