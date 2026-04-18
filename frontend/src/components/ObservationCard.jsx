
const ObservationCard = ({ title, desc, type }) => {
  const emojiMap = {
    Sleep: "😴",
    Digital: "📱",
    Activity: "🚶",
    Mood: "😔",
  };

  const colorMap = {
    Sleep: "border-rose-500",
    Digital: "border-amber-500",
    Activity: "border-sky-500",
    Mood: "border-purple-500",
  };

  return (
    <div className={`glass p-8 rounded-[2.5rem] border-b-4 ${colorMap[type]}`}>
      <div className="text-4xl mb-4">{emojiMap[type]}</div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
};
export default ObservationCard