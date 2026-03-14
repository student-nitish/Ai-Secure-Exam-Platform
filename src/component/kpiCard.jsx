// components/KpiCard.jsx
import CountUp from "react-countup";

const KpiCard = ({ title, value, icon: Icon, color = "text-white" }) => {
  return (
    <div className="bg-[#0f172a] p-6 rounded-xl hover:scale-[1.03] transition flex items-center justify-between">

      {/* LEFT CONTENT */}
      <div>
        <p className="text-gray-400 text-sm mb-1">
          {title}
        </p>

        <h2 className={`text-3xl font-bold ${color}`}>
          <CountUp end={value} duration={1.6} separator="," />
        </h2>
      </div>

      {/* ICON */}
      <div className="bg-[#1e293b] p-3 rounded-lg">
        {Icon && <Icon size={18} className="text-blue-400" />}
      </div>

    </div>
  );
};

export default KpiCard;