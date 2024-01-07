import house from "../PublicImages/house.png";
import person from "../PublicImages/person.png";
import chat from "../PublicImages/chat.png";
import clipboard from "../PublicImages/clipboard.png";
import box from "../PublicImages/box.png";
import walking from "../PublicImages/walking.png";
import { Link, useLocation } from "react-router-dom";
import { baseURL } from "../../urlConfig";


export function sidebar() {

  const isActive = (path) => {
    // Check if the current location matches the given path
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Remove the session token from local storage
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");

    // You may also want to redirect the user to the login page or perform other actions here
  };

  return (
    <div className="side-bar">
      <Link to="/user/blogs" className={`sidebar-icon ${isActive("/user/blogs") ? 'active-icon' : ''}`}>
        <div>
          <img className="icon-text" src={chat} alt="blog"></img>
          <p className="icon-subtext">Blog</p>
        </div>
      </Link>

      <Link to="/user/profile" className={`sidebar-icon ${isActive("/user/profile") ? 'active-icon' : ''}`}>
        <div>
          <img className="icon-text" src={person} alt="account"></img>
          <p className="icon-subtext">Account</p>
        </div>
      </Link>

      <Link to="/user/list" className={`sidebar-icon ${isActive("/user/list") ? 'active-icon' : ''}`}>
        <div>
          <img className="icon-text" src={house} alt="reviews"></img>
          <p className="icon-subtext">Reviews</p>
        </div>
      </Link>

      <Link to="/listings" className={`sidebar-icon ${isActive("/listings") ? 'active-icon' : ''}`}>
        <div>
        <img className="icon-text" src={clipboard} alt="listings"></img>
          <p className="icon-subtext">Listings</p>
        </div>
      </Link>

      <Link to="/user/application/list" className={`sidebar-icon ${isActive("/user/application/list") ? 'active-icon' : ''}`}>
        <div>
        <img className="icon-text" src={box} alt="my applications"></img>
          <p className="icon-subtext">My Applications</p>
        </div>
      </Link>

      <Link to="/login" onClick={handleLogout} className={`sidebar-icon ${isActive("/login") ? 'active-icon' : ''}`}>
        <div>
        <img className="icon-text" src={walking} alt="logout"></img>
          <p className="icon-subtext">Logout</p>
        </div>
      </Link>
    </div>
  );
}
