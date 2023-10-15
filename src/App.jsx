import { useState } from "react";
import "./App.css";

export default function Game() {
    const [history, setHistory] = useState([
        {
            squares: Array(9).fill(null),
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
        ? `Winner:  ${winner.winner} - Press "Reset Game to create New Game"`
        : history.length === 10 && !winner
        ? `Draw - Press "Reset Game to create New Game"`
        : "Next player: " + (xIsNext ? "X" : "O");

    const moves = history.map((step, move) => {
        const desc = move ? "Go to move #" + move : "Go to move #0";
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

function Board({ squares, onClick, winner }) {
    const renderSquare = (i) => (
        <Square
            value={squares[i]}
            onClick={() => onClick(i)}
            winner={winner && winner.winningSquares.includes(i)}
            key={i}
        />
    );

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

function Square({ value, onClick, winner }) {
    return (
        <button
            className={`square ${winner ? "highlight" : ""}`}
            onClick={onClick}
        >
            {value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return {
                winner: squares[a],
                winningSquares: [a, b, c],
            };
        }
    }
    return null;
}
