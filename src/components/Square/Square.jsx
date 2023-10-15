import "./styles.css";

export default function Square({ value, onClick, winner }) {
    return (
        <button
            className={`square ${winner ? "highlight" : ""}`}
            onClick={onClick}
        >
            {value}
        </button>
    );
}
