import "../shelterlist.css";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../urlConfig";

export function ShelterBox(shelterInfo) {
  const navigate = useNavigate();

  const redirectToShelterView = () => {
    if (localStorage.getItem("userType") === "1") {
      navigate(`/user/shelterview/${shelterInfo.id}`);
    } else {
      navigate(`/shelter/shelterview/${shelterInfo.id}`);
    }
    
  };
  return (
    <a onClick={redirectToShelterView}>
    <div className="box">
      <h1>{shelterInfo.name}</h1>
        <p>Address: {shelterInfo.address}</p>
        <p>Phone: {shelterInfo.phoneNum}</p>
        <p>Email: {shelterInfo.email}</p>
        <p>"{shelterInfo.address}"</p>
    </div>
    </a>
  );
}
