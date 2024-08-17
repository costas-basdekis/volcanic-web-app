import {useCallback, useState} from "react";
import "./Credits.css";

export function Credits() {
  const [showCredits, setShowCredits] = useState(false);
  const toggleShowCredits = useCallback(() => {
    setShowCredits(showCredits => !showCredits);
  }, []);
  return <>
    <div className={"credits-button-container"}>
      <button onClick={toggleShowCredits}>Credits</button>
    </div>
    <div className={`credits ${showCredits ? '' : "hidden"}`}>
      <h2>
        Credits
      </h2>
      <ul>
        <li><a href={"https://www.flaticon.com/free-icons/volcano"} title={"volcano icons"}>
          Volcano icons created by Freepik - Flaticon
        </a>
      </li>
      </ul>
    </div>
  </>;
}
