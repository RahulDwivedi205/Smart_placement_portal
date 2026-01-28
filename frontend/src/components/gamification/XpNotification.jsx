import { useState, useEffect } from 'react';

const XpNotification = ({ xpGained, action, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (xpGained > 0) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [xpGained, onComplete]);

  if (!isVisible) return null;

  const getActionEmoji = (action) => {
    const emojis = {
      'profile_complete': '👤',
      'first_application': '🚀',
      'interview_scheduled': '🎯',
      'skill_added': '⚡',
      'application_submitted': '📝',
      'daily_login': '📅',
      'offer_received': '🎁',
      'placement_success': '🏆'
    };
    return emojis[action] || '⭐';
  };

  return (
    <div className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ${
      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-white/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="text-2xl animate-bounce">
            {getActionEmoji(action)}
          </div>
          <div>
            <div className="font-bold text-lg">
              +{xpGained} XP Gained!
            </div>
            <div className="text-purple-100 text-sm capitalize">
              {action?.replace('_', ' ')}
            </div>
          </div>
          <div className="text-3xl animate-pulse">
            ✨
          </div>
        </div>
        
        {/* Animated particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-ping delay-75"></div>
      </div>
    </div>
  );
};

export default XpNotification;