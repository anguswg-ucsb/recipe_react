const Card = ({ title, color, id, setActiveCardId, activeCardId }) => {
  return (
    <div
      onClick={() => setActiveCardId(id)}
      className={`w-${activeCardId === id ? 40 : 32} border-2 border-black m-4`}
    >
      <div className="h-8 text-center">{title}</div>
      <div className={`h-${activeCardId === id ? 40 : 32} bg-${color}`} />
      <div className="h-12" />
    </div>
  );
};
