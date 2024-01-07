import "./applicationbox.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";
import { baseURL } from "../../../urlConfig";

export function ApplicationBox(application) {
    const navigate = useNavigate();
    const [listingInfo, setListingInfo] = useState(null);
    const status = {
        1: "Pending",
        2: "Accepted",
        3: "Denied",
        4: "Withdrawn"
    };

    const redirectToApplication = (event) => {
        if (event.target.tagName.toLowerCase() !== 'button') {
            navigate(`/user/application/view/${application.id}`);
        }
    };

    useEffect(() => {
        const fetchApplicationInfo = async () => {
          try {
            const response = await Axios.get(
                `${baseURL}/listings/listing/${application.listing}/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            setListingInfo(response.data);
            console.log(response.data);
          } catch (error) {
            console.error("Error fetching application information:", error);
          }
        };
    
        if (application.listing) {
          fetchApplicationInfo();
        }
    }, [application.listing]);
    
    function viewApplicationUser() {
        navigate(`/user/application/view/${application.id}`);
    }

    function viewApplicationShelter() {
        navigate(`/shelter/application/view/${application.id}`);
    }

    if (localStorage.getItem("userType") === "2") {
        return (
            <a onClick={redirectToApplication}>
            <div className="applicationbox">
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <h1 style={{margin:0, flex: 1}}>
                        {application.first_name} {application.last_name} <br />
                        wants to apply for {listingInfo ? listingInfo.name : "Unknown Listing"}
                    </h1>
                    <button style={{margin:0}}
                    onClick={viewApplicationShelter}
                    >View</button>
                </div>
                <p>Status: {status[application.status]}</p>
            </div>
            </a>
        );
    }

    return (
        <a onClick={redirectToApplication}>
        <div className="applicationbox">
            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <h1 style={{margin:0, flex: 1}}>
                    Application for: {listingInfo ? listingInfo.name : "Unknown Listing"}
                </h1>
                <button style={{margin:0}}
                onClick={viewApplicationUser}
                >View</button>
            </div>
            <p>Status: {status[application.status]}</p>
        </div>
        </a>
  );
}