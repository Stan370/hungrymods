import React from 'react';
import { GameObject } from '../../types/game';
import { 
  MessageCircle, 
  Award, 
  Shield, 
  Cake,
  AlertTriangle,
  Copy
} from 'lucide-react';

interface GameAreaProps {
  gameObjects: GameObject[];
  onCatch: (id: string) => void;
  timeLeft: number;
  score: number;
  combo: number;
  powerUps: {
    modProtection: boolean;
    cakeDay: number;
  };
  postKarma: number;
}

const GameArea: React.FC<GameAreaProps> = ({ 
  gameObjects, 
  onCatch, 
  timeLeft, 
  score, 
  combo,
  powerUps,
  postKarma
}) => {
  const getObjectIcon = (type: GameObject['type']) => {
    switch (type) {
      case 'good-comment': return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'bad-comment': return <MessageCircle className="w-4 h-4 text-red-600" />;
      case 'repost': return <Copy className="w-4 h-4 text-purple-600" />;
      case 'gold-award': return <Award className="w-4 h-4 text-yellow-500" />;
      case 'mod-warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'cake-day': return <Cake className="w-4 h-4 text-pink-500" />;
      case 'rickroll': return <span className="text-xs">🎵</span>;
      default: return null;
    }
  };

  const getObjectStyle = (obj: GameObject) => {
    const baseClasses = "absolute cursor-pointer transition-all duration-100 hover:scale-105 rounded-lg p-2 text-xs font-medium shadow-md";
    const typeClasses = {
      'good-comment': 'bg-green-100 hover:bg-green-200 border-2 border-green-300 text-green-800',
      'helpful-comment': 'bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 text-blue-800',
      'bad-comment': 'bg-red-100 hover:bg-red-200 border-2 border-red-300 text-red-800 animate-pulse',
      'spam-bot': 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 text-gray-800',
      'repost': 'bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 text-purple-800',
      'gold-award': 'bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-300 text-yellow-800 animate-bounce',
      'mod-warning': 'bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 text-orange-800 animate-pulse',
      'cake-day': 'bg-pink-100 hover:bg-pink-200 border-2 border-pink-300 text-pink-800',
      'rickroll': 'bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 text-blue-800'
    };

    return `${baseClasses} ${typeClasses[obj.type]}`;
  };

  const getCommentText = (obj: GameObject) => {
    if (!obj.text) return '';
    return obj.text.length > 30 ? obj.text.substring(0, 30) + '...' : obj.text;
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-gray-50 to-orange-50 border-4 border-orange-500 rounded-lg overflow-hidden">
      {/* Post Header */}
      <div className="absolute top-2 left-2 right-2 z-10 bg-white/95 rounded-lg p-2 shadow-lg border-l-4 border-orange-500">
        <div className="text-sm font-bold text-gray-800">
          🔥 Your post: "When you realize it's Monday tomorrow" 
        </div>
        <div className="text-xs text-gray-600 flex gap-4">
          <span>↑ {postKarma.toLocaleString()} karma</span>
          <span>💬 {score} comments managed</span>
          <span>⏰ {timeLeft}s left</span>
        </div>
      </div>

      {/* Game Stats */}
      <div className="absolute top-20 left-2 z-10 bg-white/90 rounded-lg p-2 shadow-lg">
        <div className="text-xs font-bold text-gray-800">Moderation Score: {score}</div>
        <div className="text-xs text-orange-600">Streak: x{combo}</div>
      </div>

      {/* Power-ups Display */}
      {(powerUps.modProtection || powerUps.cakeDay > 0) && (
        <div className="absolute top-20 right-2 z-10 bg-white/90 rounded-lg p-2 shadow-lg">
          <div className="text-xs font-bold text-gray-800 mb-1">Active:</div>
          {powerUps.modProtection && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Shield className="w-3 h-3" />
              Mod Shield
            </div>
          )}
          {powerUps.cakeDay > 0 && (
            <div className="flex items-center gap-1 text-xs text-pink-600">
              <Cake className="w-3 h-3" />
              Cake Day ({powerUps.cakeDay}s)
            </div>
          )}
        </div>
      )}

      {/* Falling Comments */}
      {gameObjects.map((obj) => (
        <div
          key={obj.id}
          className={getObjectStyle(obj)}
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            transform: 'translate(-50%, -50%)',
            maxWidth: '200px',
            minWidth: '120px'
          }}
          onClick={() => onCatch(obj.id)}
        >
          <div className="flex items-center gap-1 mb-1">
            {getObjectIcon(obj.type)}
            <span className="font-semibold">
              {obj.type === 'good-comment' ? 'u/happyfan' :
               obj.type === 'bad-comment' ? 'u/troll123' :
               obj.type === 'repost' ? 'u/reposter' :
               obj.type === 'gold-award' ? 'Gold Award!' :
               obj.type === 'mod-warning' ? 'MOD WARNING' :
               obj.type === 'cake-day' ? 'Cake Day!' :
               'u/rickroller'}
            </span>
          </div>
          <div className="text-xs">
            {getCommentText(obj)}
          </div>
        </div>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-white/90 rounded-lg p-2 shadow-lg">
          <div className="text-xs text-gray-600">
            Click comments to moderate them! Green = approve, Red = delete
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArea;