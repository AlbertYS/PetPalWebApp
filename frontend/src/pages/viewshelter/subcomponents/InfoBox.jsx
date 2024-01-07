import { useNavigate } from "react-router-dom";
import "../shelter-information.css";
import { baseURL } from "../../../urlConfig";

export function InfoBox(shelter) {
    const navigate = useNavigate();
    var url = "/shelter/list";
    if (localStorage.getItem("userType") === "1") {
        url = "/user/list"
    }

    function goback() {
        navigate(url);
    }

    return (
        <div className="shelter-detail-block">
            <div className="shelter-header">
                <button className="back-button" onClick={goback}>Back</button>
                <h1>{shelter.name}</h1>
            </div>

            <h2>General information</h2>
            <div>
                <p>Location: {shelter.address}</p>
            </div>
            <div>
                <p>Phone: {shelter.phoneNum}</p>
                <p>Email: {shelter.email}</p>
            </div>
            <h2>Mission statement</h2>
            <p>{shelter.mission_statement}</p>
            </div>
        )
}