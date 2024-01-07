import "./listingbox.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";
import { baseURL } from "../../../urlConfig";

export function ListingBox(listing) {
    const navigate = useNavigate();
    const [shelterInfo, setShelterInfo] = useState(null);
    const status = {
        1: "Available",
        2: "Adopted",
        3: "Pending",
        4: "Withdrawn"
    }

    var presstext = "Apply";
    if (listing.disable) {
        presstext = "Already Applied";
    }
    if (localStorage.getItem("userType") == "2") {
        presstext = "Update";
    }

    const redirectToShelterView = (event) => {
        if (event.target.tagName.toLowerCase() !== 'button') {
            navigate(`/listing/${listing.id}`);
        }
    };

    useEffect(() => {
        const fetchShelterInfo = async () => {
          try {
            const response = await Axios.get(
                `${baseURL}accounts/shelter/shelter/${listing.shelter_profile}/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            setShelterInfo(response.data);
          } catch (error) {
            console.error("Error fetching shelter information:", error);
          }
        };
    
        if (listing.shelter_profile) {
          fetchShelterInfo();
        }
    }, [listing.shelter_profile]);
    
    function handle() {
        if (localStorage.getItem("userType") === "1") {
            navigate(`/user/application/${listing.id}`);
        } else {
            navigate(`/listings/edit/${listing.id}`);
        }
        
    }

    return (
        <a onClick={redirectToShelterView}>
        <div className="listingbox">
            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <h1 style={{margin:0, flex: 1}}>{listing.name}</h1>
                <button style={{margin:0}} disabled={listing.disable}
                onClick={handle}
                >{presstext}</button>
            </div>
            <h2>Posted by: {shelterInfo ? shelterInfo.name : "Unknown Shelter"}</h2>
            <p>Breed: {listing.breed}</p>
            <p>Age: {listing.age}</p>
            <p>Gender: {listing.gender}</p>
            <p>Size: {listing.size}</p>
            <p><b>Description:</b> {listing.description}</p>
            <p>Status: {status[listing.status]}</p>
            <p>Location: {listing.location}</p>
            <p>Publication Date: {listing.publication_date}</p>
        </div>
        </a>
  );
}