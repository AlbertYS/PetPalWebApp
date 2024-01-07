import "../PublicCSS/templatestyle.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { baseURL } from "../../urlConfig.js";

export function ShelterPreviewBlog() {
    const storedData = JSON.parse(localStorage.getItem("blog"));
    const navigate = useNavigate();
  
    const renderInputs = () => {
        if (!storedData) {
            return null;
        }
      return storedData.map((input, index) => {
        if (input.type === "text") {
          return (
            <p key={index}>
              {input.value}
            </p>
          );
        } else if (input.type === "file") {
          return (
            <div key={index}>
              <img
                src={input.value}
                alt={`File ${index + 1}`}
                style={{ maxWidth: '100%', maxHeight: '400px', marginTop: '10px' }}
              />
            </div>
          );
        } else if (input.type === "subtitle") {
          return (
            <h2 key={index}>
              {input.value}
            </h2>
          );
        } else {
            return (
                <h1 key={index}>
                    {input.value}
                </h1>
            )
        }
        return null; // Handle other types if needed
      });
    };

    function handleBack() {
        navigate("/blog/create");
    }
  
    return (
      <div>
        {header()}
        {sidebar()}
        <div className="content-box">
            <div
            style={{display: "flex", justifyContent: "flex-end", margin:0, marginBottom:"-2rem"}}
            >
                <button onClick={handleBack}
                style={{margin:0}}>
                    Back
                </button>
            </div>
            {renderInputs()}
        </div>
      </div>
    );
  }