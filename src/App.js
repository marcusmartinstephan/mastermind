import "./App.css";
import { useState, useRef } from "react";
import item_1 from "./images/item_1.png";
import item_2 from "./images/item_2.png";
import item_3 from "./images/item_3.png";
import item_4 from "./images/item_4.png";
import item_5 from "./images/item_5.png";
import item_6 from "./images/item_6.png";

const toGuess = 4;
const maxCols = 5;
const maxRows = 9;
const items = [null, item_1, item_2, item_3, item_4, item_5, item_6];

function App() {
  const [round, setRound] = useState(1);

  const createRow = (row) => {
    let rowClass = row === 1 ? "row row-1" : "row";
    if (row > round) {
      rowClass += " rowDark";
    }
    return <div className={rowClass}>ROW</div>;
  };

  const createPlayField = () => {
    return (
      <>
        {[...Array(maxRows).keys()]
          .filter(function (value) {
            return value !== 0;
          })
          .sort(function (a, b) {
            return b - a;
          })
          .map((row) => {
            return createRow(row);
          })}
      </>
    );
  };

  const createItems = (itemsArray) => {
    return itemsArray.map((aItem) => {
      return (
        <div key={aItem}>
          <img
            onDragStart={(e) => {
              e.dataTransfer.setData("text", `item_${aItem}`);
            }}
            className="itemsPin"
            src={`../images/item_${aItem}.png`}
          ></img>
        </div>
      );
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="board">
          <div className="leftField">
            <div className="headline">Mastermind Lovers</div>
            <div className="itemsColumns">
              <div>{createItems([1, 2, 3])}</div>
              <div>{createItems([4, 5, 6])}</div>
            </div>
            <div className="headline">
              Drag and drop dogs into the dog houses to guess the dog
              combination the computer has selected and is hidding
              <br />
              Click the owl to see how good you guess is
              <br />
              <img className="resultOwl" src="images/black_owl.png" /> Means you
              picked a right dog and placed her in the right position.
              <br />
              <br />
              <img className="resultOwl" src="images/white_owl.png" /> Means you
              picked a right dog but placed her in the wrong position.
              <br />
              <br />
              <button
                onClick={() => {
                  window.location.reload();
                }}
              >
                NEW GAME
              </button>{" "}
            </div>
          </div>
          <div className="spaceCol"></div>
          <div className="playField">{createPlayField()}</div>
          <div className="spaceCol"></div>
        </div>
      </header>
    </div>
  );
}

export default App;
