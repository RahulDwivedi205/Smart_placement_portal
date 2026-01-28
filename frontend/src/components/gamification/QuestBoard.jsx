import { useState } from 'react';
import { GAMIFICATION } from '../../constants';
import Button from '../ui/Button';

const QuestBoard = ({ userProgress = {}, onQuestComplete }) => {
  const [activeQuests, setActiveQuests] = useState(Object.keys(GAMIFICATION.QUESTS));

  const getQuestProgress = (questKey) => {
    const quest = GAMIFICATION.QUESTS[questKey];
    const progress = userProgress[questKey] || 0;
    return Math.min(100, (progress / quest.target) * 100);
  };

  const isQuestComplete = (questKey) => {
    return getQuestProgress(questKey) >= 100;
  };

  const handleClaimReward = (questKey) => {
    const quest = GAMIFICATION.QUESTS[questKey];
    onQuestComplete?.(questKey, quest.reward);
    setActiveQuests(prev => prev.filter(q => q !== questKey));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        📋 Active Quests
        <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {activeQuests.length} Active
        </span>
      </h3>
      
      <div className="space-y-3">
        {activeQuests.map(questKey => {
          const quest = GAMIFICATION.QUESTS[questKey];
          const progress = getQuestProgress(questKey);
          const isComplete = isQuestComplete(questKey);
          
          return (
            <div
              key={questKey}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                isComplete 
                  ? 'border-green-300 bg-green-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{quest.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-800">{quest.name}</h4>
                    <p className="text-sm text-gray-600">
                      Progress: {userProgress[questKey] || 0}/{quest.target}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-600">
                    +{quest.reward} XP
                  </div>
                  {isComplete && (
                    <Button
                      size="sm"
                      onClick={() => handleClaimReward(questKey)}
                      className="mt-1 bg-green-600 hover:bg-green-700"
                    >
                      Claim! 🎁
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isComplete 
                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                      : 'bg-gradient-to-r from-purple-400 to-purple-600'
                  }`}
                  style={{ width: `${progress}%` }}
                >
                  {isComplete && (
                    <div className="h-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                      COMPLETE!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {activeQuests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🏆</div>
          <p>All quests completed!</p>
          <p className="text-sm">New quests will be available soon.</p>
        </div>
      )}
    </div>
  );
};

export default QuestBoard;