import "./account.css";
import "../PublicCSS/templatestyle.css";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { baseURL } from "../../urlConfig.js";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export function ShelterDelete() {
    const navigate = useNavigate();

    function goback() {
        navigate("/shelter/profile");
    }

    const deleteaccount = async() => {
        const token = localStorage.getItem("token");
        const response = await Axios.delete(
            `${baseURL}accounts/deletion/`,
            {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
            },
        ).catch((error) => console.log(error));
        navigate("/");
    }

    return (
        <div>
        {header()}
        {sidebar()}
        <div className="content-box">
            <h1>
            <b>Are you sure you want to delete your account?</b>
            </h1>
            <div style={{width:"100%", display:"flex"}}>
                <div style={{width:"100%", display:"flex", justifyContent:"flex-start"}}
                onClick={deleteaccount}>
                    <button>
                        Yes, delete my account
                    </button>
                </div>
                <div style={{width:"100%", display:"flex", justifyContent:"flex-end"}}
                onClick={goback}>
                    <button>
                        No, go back!
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}