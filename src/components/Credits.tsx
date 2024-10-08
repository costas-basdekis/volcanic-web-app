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
        <li>
          Created by <a href={"https://github.com/costas-basdekis/"}>Costas Basdekis</a>.
          You you can see the source at <a href={"https://github.com/costas-basdekis/volcanic-web-app"}>volcanic-web-app</a> on Github
        </li>
        <li>
          <a href={"https://www.flaticon.com/free-icons/volcano"} title={"volcano icons"}>
            Volcano icons created by Freepik - Flaticon
          </a>
        </li>
        <li>
          <a href={"https://www.svgrepo.com/collection/chess-vectors/"} title={"chess icons"}>
            Chess icons created by SvgRepo.com - Public domain
          </a>
        </li>
      </ul>
    </div>
  </>;
}
