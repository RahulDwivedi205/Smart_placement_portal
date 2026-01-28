import { GAMIFICATION } from '../../constants';

const BadgeCollection = ({ earnedBadges = [], size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  const allBadges = Object.entries(GAMIFICATION.BADGES);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        🏅 Badge Collection
        <span className="ml-2 text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          {earnedBadges.length}/{allBadges.length}
        </span>
      </h3>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {allBadges.map(([key, badge]) => {
          const isEarned = earnedBadges.includes(key);
          
          return (
            <div
              key={key}
              className={`${sizes[size]} rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer group relative ${
                isEarned 
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg' 
                  : 'bg-gray-200 grayscale opacity-50'
              }`}
              title={badge.description}
            >
              <span className={isEarned ? 'animate-pulse' : ''}>
                {badge.icon}
              </span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                <div className="font-medium">{badge.name}</div>
                <div className="text-gray-300">{badge.description}</div>
                <div className="text-yellow-400">+{badge.xp} XP</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {earnedBadges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎯</div>
          <p>Start your journey to earn your first badge!</p>
          <p className="text-sm">Complete your profile or apply to jobs to get started.</p>
        </div>
      )}
    </div>
  );
};

export default BadgeCollection;