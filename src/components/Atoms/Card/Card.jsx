import "./Card.css";

export default function Card(props) {
  const { children, padding = "16px" } = props;
  return (
    <div className="card" style={{ padding }}>
      {children}
    </div>
  );
}
