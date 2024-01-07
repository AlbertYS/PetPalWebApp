import "./account.css";
import "../PublicCSS/templatestyle.css";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/user_sidebar.jsx";
import { profileform } from "./user_subcomponents/userprofileform";
import { baseURL } from "../../urlConfig.js";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const navigate = useNavigate();

    function deleteaccount() {
        navigate("/user/delete");
    }
  

  return (
    <div>
      {header()}
      {sidebar()}
      <div className="content-box">
        <div style={{display:"flex", width:"100%", alignItems: "flex-start"}}>
          <div style={{display:"flex", width:"100%", justifyContent:"flex-start"}}>
            <h1>
              <b>Your account information</b>
            </h1>
          </div>
          <div style={{display:"flex", width:"100%", marginTop:"-2rem",
          justifyContent:"flex-end", alignItems: "flex-start"}}>
            <button
            onClick={deleteaccount}>
              Delete account
            </button>
          </div>
        </div>
        {profileform()}
      </div>
    </div>
  );
}
