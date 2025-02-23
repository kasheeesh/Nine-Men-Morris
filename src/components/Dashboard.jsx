// import React, { useEffect, useState } from "react";
// import CalendarHeatmap from "react-calendar-heatmap";
// import "react-calendar-heatmap/dist/styles.css"; // Default styling, customize as needed

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [heatmapData, setHeatmapData] = useState({});
//   const [playerRank, setPlayerRank] = useState(null);

//   // Assuming token is stored in localStorage after login
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchPlayerStats = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/player-stats", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         setStats(data);
//       } catch (error) {
//         console.error("Error fetching player stats:", error);
//       }
//     };

//     const fetchHeatmapData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/heatmap-data", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         setHeatmapData(data);
//       } catch (error) {
//         console.error("Error fetching heatmap data:", error);
//       }
//     };

//     const fetchPlayerRank = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/player-rank", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         setPlayerRank(data);
//       } catch (error) {
//         console.error("Error fetching player rank:", error);
//       }
//     };

//     fetchPlayerStats();
//     fetchHeatmapData();
//     fetchPlayerRank();
//   }, [token]);

//   // Format heatmap data: convert activityHistory object into an array
//   const heatmapValues = Object.keys(heatmapData).map((date) => ({
//     date,
//     count: heatmapData[date],
//   }));

//   // Calculate date range for the past year
//   const today = new Date();
//   const lastYear = new Date();
//   lastYear.setFullYear(today.getFullYear() - 1);

//   return (
//     <div className="dashboard" style={{ padding: "20px" }}>
//       <h1>Profile Dashboard</h1>

//       {stats ? (
//         <>
//           <section>
//             <h2>Game Statistics</h2>
//             <p>
//               <strong>Total Games Played:</strong> {stats.totalGamesPlayed}
//             </p>
//             <h3>Individual Game Counts</h3>
//             <ul>
//               {stats.gamesPlayed &&
//                 Object.entries(stats.gamesPlayed).map(([game, count]) => (
//                   <li key={game}>
//                     <strong>{game}:</strong> {count}
//                   </li>
//                 ))}
//             </ul>
//           </section>

//           <section>
//             <h2>Leaderboard Data</h2>
//             {playerRank ? (
//               <>
//                 <h3>Highest Scores</h3>
//                 <ul>
//                   {playerRank.highestScores &&
//                     Object.entries(playerRank.highestScores).map(
//                       ([game, details]) => (
//                         <li key={game}>
//                           <strong>{game}:</strong> {details.highestScore}
//                         </li>
//                       )
//                     )}
//                 </ul>
//                 <h3>Ranks</h3>
//                 <ul>
//                   {playerRank.rank &&
//                     Object.entries(playerRank.rank).map(([game, rank]) => (
//                       <li key={game}>
//                         <strong>{game}:</strong> Rank {rank}
//                       </li>
//                     ))}
//                 </ul>
//               </>
//             ) : (
//               <p>Loading leaderboard data...</p>
//             )}
//           </section>

//           <section>
//             <h2>Activity Heatmap</h2>
//             <CalendarHeatmap
//               startDate={lastYear}
//               endDate={today}
//               values={heatmapValues}
//               classForValue={(value) => {
//                 if (!value) {
//                   return "color-empty";
//                 }
//                 if (value.count >= 4) {
//                   return "color-scale-4";
//                 } else if (value.count >= 3) {
//                   return "color-scale-3";
//                 } else if (value.count >= 2) {
//                   return "color-scale-2";
//                 } else if (value.count >= 1) {
//                   return "color-scale-1";
//                 }
//                 return "color-empty";
//               }}
//               tooltipDataAttrs={(value) => {
//                 return {
//                   "data-tip": `${value.date}: ${value.count} activity`,
//                 };
//               }}
//               showWeekdayLabels={true}
//             />
//           </section>
//         </>
//       ) : (
//         <p>Loading stats...</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Custom Card Component (Replace if using a UI library)
const Card = ({ children }) => <div className="border rounded-lg p-4 shadow-md">{children}</div>;
const CardContent = ({ children }) => <div>{children}</div>;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [rankData, setRankData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, heatmapRes, rankRes] = await Promise.all([
          fetch("http://localhost:5000/player-stats", { headers }),
          fetch("http://localhost:5000/heatmap-data", { headers }),
          fetch("http://localhost:5000/player-rank", { headers }),
        ]);

        setStats(await statsRes.json());
        const heatmapRaw = await heatmapRes.json();
        setHeatmapData(Object.entries(heatmapRaw).map(([date, count]) => ({ date, count })));
        setRankData(await rankRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Game Dashboard</h1>

      {/* Games Played Chart */}
      {stats?.gamesPlayed && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Games Played</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(stats.gamesPlayed).map(([game, count]) => ({ game, count }))}
              >
                <XAxis dataKey="game" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Heatmap */}
      {heatmapData.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Activity Heatmap</h2>
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={heatmapData}
              classForValue={(value) => (value ? `bg-green-500 opacity-${value.count * 2}` : "bg-gray-200")}
              showWeekdayLabels
            />
          </CardContent>
        </Card>
      )}

      {/* Player Rank */}
      {rankData && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Player Rank</h2>
            <p>Highest Scores:</p>
            <ul>
              {Object.entries(rankData.highestScores ?? {}).map(([game, score]) => (
                <li key={game} className="text-lg">{game}: {score}</li>
              ))}
            </ul>
            <p className="mt-4">Ranks:</p>
            <ul>
              {Object.entries(rankData.rank ?? {}).map(([game, rank]) => (
                <li key={game} className="text-lg">{game}: {rank ? `#${rank}` : "Not Ranked"}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
