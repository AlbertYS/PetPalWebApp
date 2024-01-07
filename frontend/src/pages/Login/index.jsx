import { loginform } from "./subcomponents/form";
import { signupbox } from "./subcomponents/signup-box";
import { baseURL } from "../../urlConfig";

import logo from "../PublicImages/logo.png";
import "./login.css";

export function Login() {
  return (
    <div className="center-box">
      <div className="signin-box">
        <div className="greeting-card">
          <img className="logo" src={logo} alt="Petpal"></img>
          <div className="greeting">
            <h2>Welcome back to PetPal!</h2>
          </div>
        </div>
      {loginform()}
      </div>
      {signupbox()}
    </div>
  );
}
