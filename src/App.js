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
  const [winning, setWinning] = useState(false);
  const [showCombination, setShowCombination] = useState(false);
  const [round, setRound] = useState(1);
  const guessResults = useRef([]);
  const currentRow = [];

  const shuffle = (array) => {
    return [
      null,
      ...array
        .sort(() => Math.random() - 0.5)
        .filter((value) => {
          return value !== 0;
        })
        .slice(2),
    ];
  };

  const hiddenCombination = useRef([]);
  if (Object.keys(hiddenCombination.current).length === 0)
    hiddenCombination.current = [...shuffle([1, 2, 3, 4, 5, 6])];

  const validateRow = () => {
    console.log("hidden combination:", hiddenCombination);
    console.log("current row, round:", currentRow, round);
    // compare current row with hiddenCombination
    // create a result array of four
    // add one to black means item plus position is right
    // add one to white means item is right but not position
    if (!guessResults[round])
      guessResults.current[round] = { black: 0, white: 0 };
    currentRow.forEach((guessItem, index) => {
      const indexOfGuessItem = hiddenCombination.current.indexOf(
        parseInt(guessItem),
        1
      );
      if (indexOfGuessItem !== -1 && indexOfGuessItem === index) {
        guessResults.current[round].black += 1;
      } else {
        if (indexOfGuessItem !== -1 && indexOfGuessItem) {
          guessResults.current[round].white += 1;
        }
      }
    });
    console.log("guess results:", guessResults);
    if (guessResults.current[round].black === toGuess) {
      setShowCombination(true);
      setWinning(true);
    } else {
      if (round < maxRows - 1 && !winning) {
        setRound(round + 1);
      }
    }
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId = e.target.id;
    const itemNumber = e.dataTransfer.getData("text");
    const itemArr = itemNumber.split("_", 2);
    const itemId = itemArr[1];
    const targetArr = targetId.split("_", 2);
    const colElement = document.getElementById(
      targetArr[0] + "_" + targetArr[1]
    );
    colElement.src = items[itemId];
    currentRow[targetArr[1]] = itemArr[1];
  };

  const createCol = (row, col) => {
    return (
      <div
        className="col"
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          handleOnDrop(e);
        }}
      >
        <img
          id={`${row}_${col}`}
          className="itemSpot"
          src="images/item_spot.png"
          alt=""
        />
      </div>
    );
  };

  const createCheckCol = (row) => {
    return (
      <div id={`${row}_${maxCols + 1}`} className="col">
        <img
          className="owl"
          src="/images/owl.png"
          alt="Check / Validate"
          onClick={(e) => {
            validateRow(row);
          }}
        />
      </div>
    );
  };

  const createResultCol = (row) => {
    if (guessResults.current[row]) {
      return (
        <div id={`${row}_${maxCols + 1}`} className="col result-col">
          {[...Array(guessResults.current[row].black).keys()].map(
            (item, index) => {
              return (
                <img
                  className="resultOwl"
                  src="images/black_owl.png"
                  alt="Result"
                />
              );
            }
          )}
          {[...Array(guessResults.current[row].white).keys()].map(
            (item, index) => {
              return (
                <img
                  className="resultOwl"
                  src="images/white_owl.png"
                  alt="Result"
                />
              );
            }
          )}
          {[
            ...Array(
              4 -
                guessResults.current[row].white -
                guessResults.current[row].black
            ).keys(),
          ].map(() => {
            return (
              <img
                className="resultOwl"
                src="images/result_placeholder.png"
                alt="Result"
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <div id={`${row}_${maxCols + 1}`} className="col result-col">
          <img
            className="resultOwl"
            src="images/result_placeholder.png"
            alt="Result"
          />
          <img
            className="resultOwl"
            src="images/result_placeholder.png"
            alt="Result"
          />
          <img
            className="resultOwl"
            src="images/result_placeholder.png"
            alt="Result"
          />
          <img
            className="resultOwl"
            src="images/result_placeholder.png"
            alt="Result"
          />
        </div>
      );
    }
  };

  const createRow = (row) => {
    let rowClass = row === 1 ? "row row-1" : "row";
    if (row > round) {
      rowClass += " rowDark";
    }
    return (
      <div className={rowClass}>
        <div className="col col-1">Guess {row}</div>
        {[...Array(maxCols).keys()]
          .filter(function (value) {
            return value !== 0;
          })
          .map((col) => {
            return createCol(row, col);
          })}
        {createCheckCol(row)}
        {createResultCol(row)}
      </div>
    );
  };

  const createCombinationRow = () => {
    if (!showCombination)
      return (
        <div className="row combinationRow">
          COMBINATION IS HIDDEN HERE
          <button
            onClick={(e) => {
              setShowCombination(true);
            }}
          >
            Show Combination
          </button>
        </div>
      );
    return (
      <div className="row combinationRow">
        <div className="col col-1">CODE</div>
        <div className="col">
          <img
            className="itemSpot"
            src={`../images/item_${hiddenCombination.current[1]}.png`}
            alt=""
          />
        </div>
        <div className="col">
          <img
            className="itemSpot"
            src={`../images/item_${hiddenCombination.current[2]}.png`}
            alt=""
          />
        </div>
        <div className="col">
          <img
            className="itemSpot"
            src={`../images/item_${hiddenCombination.current[3]}.png`}
            alt=""
          />
        </div>
        <div className="col">
          <img
            className="itemSpot"
            src={`../images/item_${hiddenCombination.current[4]}.png`}
            alt=""
          />
        </div>
        <div className="col c55"></div>
        <div className="col c100">
          {showCombination && !winning && (
            <button
              onClick={(e) => {
                setShowCombination(false);
              }}
            >
              Hide Combination
            </button>
          )}
          {winning && <span style={{ fontSize: "24px" }}>YOU WON!</span>}
        </div>
      </div>
    );
  };

  const createPlayField = () => {
    return (
      <>
        {createCombinationRow()}
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
