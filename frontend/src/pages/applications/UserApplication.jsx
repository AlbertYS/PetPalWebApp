import "./application.css";
import "../PublicCSS/templatestyle.css";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/user_sidebar.jsx";
import { form } from "./Form";
import { baseURL } from "../../urlConfig.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function UserApplication() {

  const navigate = useNavigate();

  useEffect(() => {
    checkUserTypeAndNavigate();
  }, []);

  const checkUserTypeAndNavigate = () => {
    if (localStorage.getItem("userType") === "2") {
      navigate("/shelter/application/list");
    }
  };

  function navigateBack() {
    navigate("/listings");
  }

  return (
    <div>
      {header()}
      {sidebar()}
      <div className="content-box">
        <div className="wrap-box">
          <h1>
          <b>Your application</b>
        </h1>
        <button className="back-button" onClick={navigateBack}>Back</button></div>
        {form()}
      </div>
    </div>
  );
}
