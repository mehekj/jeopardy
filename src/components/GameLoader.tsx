import React, { ChangeEvent } from "react";

import { GameData } from "../types";
import sample_game from "../assets/sample_game.json";
import { logEvent } from "../util/analytics";

import "./GameLoader.css";

interface GameLoaderProps {
  updateGame: (game: GameData) => void;
}

function GameLoader(props: GameLoaderProps) {
  const { updateGame } = props;
  const [loadError, setLoadError] = React.useState("");

  function validateGame(data: any): GameData | null {
    if (data?.game === undefined) {
      console.log("Game key not found in JSON payload.");
      return null;
    }
    // TODO: additional validation
    return data as GameData;
  }

  function handleGameUpload(event: ChangeEvent<HTMLInputElement>) {
    logEvent("Upload Game");
    if (event.target.files === null) {
      return;
    }
    event.target.files[0].text().then((text) => {
      const data: any = JSON.parse(text);
      const game = validateGame(data);
      if (game !== null) {
        updateGame(game);
      } else {
        console.log("Invalid game.");
      }
    });
  }

  async function loadDiwaliGame() {
    logEvent("Load Diwali 2025 Game");
    setLoadError("");

    try {
      const response = await fetch("/diwali2025.json");
      if (!response.ok) {
        throw new Error("Unable to load the Diwali 2025 game.");
      }

      const game = validateGame(await response.json());
      if (game === null) {
        throw new Error("The Diwali 2025 game file is invalid.");
      }

      updateGame(game);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load the Diwali 2025 game."
      );
    }
  }

  function downloadSampleGame() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(sample_game, null, 4)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "sample_game.json";
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="game-loader">
      <h1>Jeopardy Player</h1>
      <p>
        Originally designed by brianyu28 on github (
        <a
          href="https://github.com/mehekj/jeopardy"
          target="_blank"
          rel="noopener noreferrer"
        >
          fork
        </a>
        ).
      </p>
      <hr />
      <h2>Play a Game</h2>
      <input type="file" name="file" onChange={handleGameUpload} />
      <hr />
      <h2>Create a Game</h2>
      <div className="create-your-own">
        To create a Jeopardy game, download the below game configuration file,
        edit it to include your desired clues, and re-upload it here.
        <div>
          <button onClick={downloadSampleGame}>Download Configuration</button>
        </div>
      </div>
      <hr />
      <h2>Play Jethani Diwali Party 2025 Game</h2>
      <button type="button" onClick={loadDiwaliGame}>
        Play Diwali 2025 Game
      </button>
      {loadError && <p className="game-loader-error">{loadError}</p>}
    </div>
  );
}

export default GameLoader;
