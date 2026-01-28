import { GAMIFICATION } from '../../constants';
import { calculateLevel } from '../../utils';

const LevelBadge = ({ xp, size = 'md', showProgress = true }) => {
  const currentLevel = calculateLevel(xp);
  const levelInfo = GAMIFICATION.LEVELS[currentLevel];
  
  const sizes = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };
  
  const getGradientColor = (color) => {
    const gradients = {
      gray: 'from-gray-400 to-gray-600',
      blue: 'from-blue-400 to-blue-600',
      green: 'from-green-400 to-green-600',
      purple: 'from-purple-400 to-purple-600',
      gold: 'from-yellow-400 to-yellow-600',
      red: 'from-red-400 to-red-600'
    };
    return gradients[color] || gradients.gray;
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${getGradientColor(levelInfo.color)} flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-110 transition-transform duration-200`}>
        {currentLevel}
      </div>
      
      {showProgress && (
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              {levelInfo.name}
            </span>
            <span className="text-xs text-gray-500">
              {xp} XP
            </span>
          </div>
          
          {currentLevel < 6 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getGradientColor(levelInfo.color)} transition-all duration-500`}
                style={{ 
                  width: `${Math.min(100, ((xp - GAMIFICATION.LEVELS[currentLevel].xpRequired) / (GAMIFICATION.LEVELS[currentLevel + 1]?.xpRequired - GAMIFICATION.LEVELS[currentLevel].xpRequired)) * 100)}%` 
                }}
              ></div>
            </div>
          )}
          
          {currentLevel >= 6 && (
            <div className="text-xs text-yellow-600 font-medium">
              🏆 MAX LEVEL ACHIEVED!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LevelBadge;