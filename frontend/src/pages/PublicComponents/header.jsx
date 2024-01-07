import {NotifDropdown} from "./headersubcomponents/notifdropdown";
import { useState, useEffect } from "react";
import { baseURL } from "../../urlConfig";

export function header() {

  const [detailsClosed, setDetailsClosed] = useState(true);

  const handleToggleDetails = () => {
    const detailsElement = document.getElementsByClassName("right-dropdown")[0];
    if (detailsElement) {
      if (!detailsElement.open) {
        setDetailsClosed(false);
      } else if (detailsElement.open) {
        setDetailsClosed(true);
      }
    }
  };

  return (
    <div className="header">
        {NotifDropdown()}
        
      <details className={`right-dropdown ${detailsClosed ? 'closed' : ''}`}>
        <summary>
          <b className="dropdown-tag" onClick={handleToggleDetails}></b>
        </summary>
        <p>

        </p>
      </details>
    </div>
  );
}
