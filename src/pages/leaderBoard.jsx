import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../servicse/apiConnector";
import { Crown } from "lucide-react";
import ModernLoader from "../component/loader";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [loading , setLoading]= useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await apiConnector("GET", "/leaderboard/global");
      setLeaders(res.data.leaderboard || []);
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);
   
  if(loading) return <ModernLoader/>
  if (!leaders.length) return null;

  const first = leaders[0];
  const second = leaders[1];
  const third = leaders[2];
  const others = leaders.slice(3);

  const userRank = leaders.findIndex((l) => l.studentId === user._id) + 1;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-9">
      <h1 className=" font-serif text-3xl md:text-4xl font-bold mb-10 text-center md:-mt-5">
        Leaderboard
      </h1>

      {/* USER RANK */}
      {userRank > 0 && (
        <div
          className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 
        border border-blue-500/40 p-5 rounded-xl mb-10 text-center"
        >
          <p className="text-gray-400 text-sm">Your Current Rank</p>

          <h2 className="text-3xl font-bold text-blue-400">#{userRank}</h2>
        </div>
      )}

      {/* PODIUM */}
      <div className="bg-[#0f172a] rounded-2xl p-10 mb-12 shadow-xl">
        <div className="flex justify-center items-end gap-10 flex-wrap">
          {/* SECOND PLACE */}
          {second && (
            <div className="flex flex-col items-center transform transition duration-300 hover:-translate-y-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-300 shadow-md">
                <img
                  src={second?.image}
                  alt={second?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-2 text-gray-300">{second.name}</p>

              <div className="bg-[#1e293b] px-4 py-2 mt-2 rounded-lg">
                {second.avgScore}%
              </div>

              <span className="text-yellow-400 mt-2 text-lg font-bold">🥈</span>
            </div>
          )}

          {/* FIRST PLACE */}
          {first && (
            <div className="flex flex-col items-center scale-110 transform transition duration-300 hover:-translate-y-3">
              {/* GLOWING CROWN */}
              <div className="relative mb-2">
                <div className="absolute inset-0 blur-xl bg-yellow-400/40 rounded-full animate-pulse"></div>

                <Crown size={40} className="relative text-yellow-400" />
              </div>

              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg shadow-yellow-500/30">
                <img
                  src={first?.image}
                  alt={first?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-3 font-semibold text-lg">{first.name}</p>

              <div className="bg-yellow-500 text-black px-5 py-2 mt-2 rounded-lg font-bold">
                {first.avgScore}%
              </div>

              <span className="text-yellow-400 mt-2 text-xl font-bold">🥇</span>
            </div>
          )}

          {/* THIRD PLACE */}
          {third && (
            <div className="flex flex-col items-center transform transition duration-300 hover:-translate-y-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-orange-400 shadow-md">
                <img
                  src={third?.image}
                  alt={third?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-2 text-gray-300">{third.name}</p>

              <div className="bg-[#1e293b] px-4 py-2 mt-2 rounded-lg">
                {third.avgScore}%
              </div>

              <span className="text-yellow-400 mt-2 text-lg font-bold">🥉</span>
            </div>
          )}
        </div>
      </div>

      {/* RANK LIST */}
      <div className="space-y-4">
        {others.map((userData, index) => {
          const rank = index + 4;
          const isCurrentUser = userData.studentId === user._id;

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-5 rounded-xl transition
              ${
                isCurrentUser
                  ? "bg-blue-600/20 border border-blue-400"
                  : "bg-[#0f172a] hover:bg-[#1e293b]"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-6">{rank}</span>

                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                  <img
                    src={userData?.image}
                    alt={userData?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span>{userData.name}</span>
              </div>

              <div className="text-blue-400 font-semibold">
                {userData.avgScore}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
