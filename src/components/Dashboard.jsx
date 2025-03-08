import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import "./dashboard.css";
import BackButton from "./BackButton";

const Dashboard = () => {
  
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [rankData, setRankData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, heatmapRes, rankRes, profileRes] = await Promise.all([
          axios.get("http://localhost:5000/player-stats", { headers }),
          axios.get("http://localhost:5000/heatmap-data", { headers }),
          axios.get("http://localhost:5000/player-rank", { headers }),
          axios.get("http://localhost:5000/user-profile", { headers }),
        ]);

        setStats(statsRes.data);
        const formattedHeatmapData = Object.entries(heatmapRes.data).map(([date, count]) => ({
          date,
          count: parseInt(count, 10) || 1,
        }));
        setHeatmapData(formattedHeatmapData);
        setRankData(rankRes.data);
        setProfileData(profileRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getColorClass = (value) => {
    if (!value) return "color-empty";
    const count = value.count;
    if (count >= 10) return "color-scale-4";
    if (count >= 7) return "color-scale-3";
    if (count >= 4) return "color-scale-2";
    if (count >= 1) return "color-scale-1";
    return "color-empty";
  };

  const calculateMaxStreak = (data) => {
    let maxStreak = 0;
    let currentStreak = 0;
    const sortedData = [...data]
      .filter(d => d.count > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedData.forEach((entry, index) => {
      if (index === 0) {
        currentStreak = 1;
        return;
      }
      const prevDate = new Date(sortedData[index - 1].date);
      const currDate = new Date(entry.date);
      const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    });
    
    return maxStreak;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700 py-10 px-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading your gaming stats...
          </div>
        </div>
      </div>
    );
  }

  const gameData = stats?.gamesPlayed 
    ? Object.entries(stats.gamesPlayed).map(([game, count]) => ({ 
        game, 
        count,
        color: game === "Space Shooter" ? "#4CAF50" : 
               game === "MiniSweeper" ? "#2196F3" : 
               game === "LexiQuest" ? "#FF9800" :
               game === "Snake" ? "#9C27B0" : "#607D8B"
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
     <div className="flex flex-col items-center mb-8 border-b pb-4">
  <div className="w-full flex justify-between items-center mb-4">
    <BackButton />
    
  </div>
  <div className="text-center">
    <h1 className="text-3xl font-bold text-gray-800">Gaming Dashboard</h1>
    <p className="text-gray-600 mt-2">Track your gaming progress and activity</p>
  </div>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Profile Card */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Profile</h2>
          {profileData ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">
                  {profileData.username?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">{profileData.username}</h3>
              <p className="text-gray-600 mb-4">{profileData.email}</p>
              <div className="w-full mt-2 pt-3 border-t border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Account Created:</span>
                  <span className="font-semibold">
                    {new Date(parseInt(profileData._id?.substring(0, 8), 16) * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Games Played:</span>
                  <span className="font-semibold">{stats?.totalGamesPlayed || 0}</span>
                </div>
                <div className="mt-4">
                  <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No profile data available
            </div>
          )}
        </div>

        {/* Games Played Chart */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Games Played</h2>
          <div className="h-64">
            {gameData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gameData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <XAxis 
                    dataKey="game" 
                    tick={{ fill: '#4a5568', fontWeight: 500 }} 
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: '#4a5568', fontWeight: 500 }} 
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Times Played" 
                    fill="#4CAF50" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No game data available
              </div>
            )}
          </div>
        </div>

        {/* Rankings Card */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Player Rankings</h2>
          {rankData ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Highest Scores</h3>
                <div className="space-y-3">
                  {Object.entries(rankData.highestScores || {}).map(([game, score]) => (
                    <div key={game} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-700">{game}</div>
                      <div className="text-lg font-bold text-blue-600">{score}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 mb-3">Your Rankings</h3>
                <div className="space-y-3">
                  {Object.entries(rankData.rank || {}).map(([game, rank]) => (
                    <div key={game} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-700">{game}</div>
                      <div className="text-lg font-bold text-blue-600">
                        {rank ? `#${rank}` : "Not Ranked"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No ranking data available
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Activity Calendar</h2>
            <p className="text-gray-600">Your gaming activity over the past year</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {heatmapData.filter(d => d.count > 0).length}
              </p>
              <p className="text-sm text-gray-600">Active Days</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {calculateMaxStreak(heatmapData)}
              </p>
              <p className="text-sm text-gray-600">Max Streak</p>
            </div>
          </div>
        </div>
        
        <div className="calendar-heatmap">
          {heatmapData.length > 0 ? (
            <CalendarHeatmap
              startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
              endDate={new Date()}
              values={heatmapData}
              classForValue={getColorClass}
              showWeekdayLabels={false}
              gutterSize={6}
              monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
              titleForValue={(value) => value ? `${value.date}: ${value.count} games` : 'No games'}
              horizontal={true}
              showOutOfRangeDays={true}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No activity data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;