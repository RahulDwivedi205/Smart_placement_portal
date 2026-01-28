import { useState } from 'react';
import { useGamification } from '../../context/GamificationContext';
import LevelBadge from './LevelBadge';
import BadgeCollection from './BadgeCollection';
import QuestBoard from './QuestBoard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { GAMIFICATION } from '../../constants';

const GamificationDashboard = () => {
  const { userStats, updateQuestProgress, completeQuest } = useGamification();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'badges', name: 'Badges', icon: '🏅' },
    { id: 'quests', name: 'Quests', icon: '📋' },
    { id: 'leaderboard', name: 'Leaderboard', icon: '🏆' }
  ];

  const mockLeaderboard = [
    { name: 'Alex Chen', level: 5, xp: 1250, avatar: '👨‍💻' },
    { name: 'Sarah Johnson', level: 4, xp: 890, avatar: '👩‍💼' },
    { name: 'You', level: userStats.level, xp: userStats.totalXp, avatar: '🚀', isCurrentUser: true },
    { name: 'Mike Wilson', level: 3, xp: 650, avatar: '👨‍🎓' },
    { name: 'Emma Davis', level: 3, xp: 580, avatar: '👩‍🔬' }
  ].sort((a, b) => b.xp - a.xp);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Progress</h3>
        <LevelBadge xp={userStats.totalXp} size="lg" />
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{userStats.totalApplications}</div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.interviewsScheduled}</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.earnedBadges.length}</div>
            <div className="text-sm text-gray-600">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{userStats.consecutiveLogins}</div>
            <div className="text-sm text-gray-600">Login Streak</div>
          </div>
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Achievements</h3>
        {userStats.earnedBadges.length > 0 ? (
          <div className="space-y-2">
            {userStats.earnedBadges.slice(-3).map(badgeKey => {
              const badge = GAMIFICATION.BADGES[badgeKey];
              return (
                <div key={badgeKey} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{badge.name}</div>
                    <div className="text-sm text-gray-600">{badge.description}</div>
                  </div>
                  <div className="ml-auto text-sm font-medium text-yellow-600">
                    +{badge.xp} XP
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p>No achievements yet!</p>
            <p className="text-sm">Complete actions to earn your first badge.</p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderLeaderboard = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Campus Leaderboard</h3>
      <div className="space-y-3">
        {mockLeaderboard.map((player, index) => (
          <div
            key={index}
            className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
              player.isCurrentUser 
                ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className={`text-lg font-bold ${
              index === 0 ? 'text-yellow-500' : 
              index === 1 ? 'text-gray-400' : 
              index === 2 ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              #{index + 1}
            </div>
            
            <div className="text-2xl">{player.avatar}</div>
            
            <div className="flex-1">
              <div className="font-medium text-gray-800">
                {player.name}
                {player.isCurrentUser && <span className="ml-2 text-purple-600">(You)</span>}
              </div>
              <div className="text-sm text-gray-600">
                Level {player.level} • {player.xp} XP
              </div>
            </div>
            
            {index < 3 && (
              <div className="text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'badges' && (
        <Card className="p-6">
          <BadgeCollection earnedBadges={userStats.earnedBadges} />
        </Card>
      )}
      {activeTab === 'quests' && (
        <Card className="p-6">
          <QuestBoard 
            userProgress={userStats.questProgress} 
            onQuestComplete={completeQuest}
          />
        </Card>
      )}
      {activeTab === 'leaderboard' && renderLeaderboard()}
    </div>
  );
};

export default GamificationDashboard;