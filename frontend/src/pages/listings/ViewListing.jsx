import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/user_sidebar.jsx";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import {ListingBox} from "./subcomponents/listingbox";
import { baseURL } from "../../urlConfig.js";

export function ViewListing() {
  const { id } = useParams();
  const [listing, setListing] = useState({});
  const navigate = useNavigate();

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
    }
  };

  function handleback() {
    navigate("/listings");
  }

  return (
    <div className={"outerbox"}>
      {header()}
      {sidebar()}
      <div className="content-box">
        <div style={{display:"flex", width:"100%", justifyContent:"flex-end"}}>
          <button
          onClick={handleback}>
            Back
          </button>
        </div>
        {ListingBox(listing)}
      </div>
    </div>
  );
}