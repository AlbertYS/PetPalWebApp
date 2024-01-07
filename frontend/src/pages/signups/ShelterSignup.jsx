import "./signupstyle.css";
import "../PublicCSS/homepage.css";
import { form } from "./shelter_subcomponents/sheltersignupform.jsx";
import { baseURL } from "../../urlConfig.js";

export function ShelterSignup() {
  return (
    <div className="signup-div">
      <h1>
        <b>Let's get an account set up!</b>
      </h1>
      {form()}
    </div>
  );
}
