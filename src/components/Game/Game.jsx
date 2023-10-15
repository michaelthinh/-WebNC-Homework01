import { useState } from "react";

import Board from "../Board/Board";

import "./styles.css";

import calculateWinner from "../../utils/calculateWinner";

export default function Game() {
    const [history, setHistory] = useState([
        {
            squares: Array(9).fill(null),
            picked: null,
        },
    ]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [isDescendingOrder, setIsDescendingOrder] = useState(true);

    const handleClick = (i) => {
        const currentHistory = history.slice(0, stepNumber + 1);
        const current =
            currentHistory[currentHistory.length - 1].squares.slice();
        if (winner || current[i]) {
            return;
        }
        current[i] = xIsNext ? "X" : "O";
        const newHistory = currentHistory.concat([
            {
                squares: current,
                picked: i,
            },
        ]);
        const newWinner = calculateWinner(current);
        setHistory(newHistory);
        setStepNumber(newHistory.length - 1);
        setXIsNext(!xIsNext);
        setWinner(newWinner);
    };

    const resetGame = () => {
        setHistory([{ squares: Array(9).fill(null) }]);
        setStepNumber(0);
        setXIsNext(true);
        setWinner(null);
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
    };

    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const status = winner
        ? `Winner:  ${winner.winner} - You CANNOT CHANGE your moves now. Press "Reset Game to create New Game"`
        : history.length === 10 && !winner
        ? `Draw - Press "Reset Game to create New Game"`
        : "Next player: " + (xIsNext ? "X" : "O");
    console.log(history);
    const moves = history.map((step, move) => {
        let desc;
        if (move === stepNumber) {
            desc = `You are at move #${move}`;
        } else if (move > 0) {
            const row = Math.floor(step.picked / 3) + 1;
            const col = (step.picked % 3) + 1;
            desc = `Go to move #${move} (${row}, ${col})`;
        } else {
            desc = "Go to first move";
        }
        // const desc = move
        //     ? "Go to move #" +
        //       move +
        //       " : ( " +
        //       ((step.picked % 3) + 1) +
        //       "," +
        //       (Math.floor(step.picked / 3) + 1) +
        //       " ) "
        //     : "Go to game start";
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    const movesList = isDescendingOrder ? moves : [...moves].reverse();

    return (
        <main>
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={handleClick}
                        winner={winner}
                    />
                </div>
                <div className="game-info">
                    <button
                        onClick={() => setIsDescendingOrder(!isDescendingOrder)}
                    >
                        Sort {isDescendingOrder ? "Ascending" : "Descending"}
                    </button>
                    <ol>{movesList}</ol>
                    <button onClick={resetGame}>Reset Game</button>{" "}
                </div>
            </div>
            <div className="system">
                <p className="system_message">System Message:</p>
                <p className="system_status">{status}</p>
            </div>
        </main>
    );
}
