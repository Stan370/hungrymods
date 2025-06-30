import React from 'react';
import { Play, Trophy, ArrowUp, Award, Shield } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="text-center space-y-6">
      {/* Game Title */}
      <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">👁️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              HungryMod Karma
            </h1>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚖️</span>
            </div>
          </div>
        <div className="text-lg text-gray-600">
        Comments are flooding in faster than you can read them. Quick - approve the good ones, delete the trolls        </div>
      </div>

      {/* Scenario Setup */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-4 border-red-500">
        <div className="text-xl font-bold text-gray-800 mb-4">
          ⚡ The Situation
        </div>
        <div className="text-gray-700 mb-4 italic">
          "It began as a hobby. Cleaning up spam. Banning bots. Keeping the subreddit tidy.
          But over time... it changed. The karma. The power. The little red buttons.
          They whispered: 'Ban them.' Now you feed on control, eyes glowing with automod regex.
          Every comment a threat. Every post... a test. This isn't moderation anymore.
          This is a purge."
        </div>
        
        <div className="space-y-3 text-left text-gray-700">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-500" />
            <span><strong>Approve the worthy</strong> - Only the purest content survives</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-500" />
            <span><strong>Purge the unworthy</strong> - Let the ban hammer fall</span>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-500" />
            <span><strong>Collect power</strong> - Each ban feeds your authority</span>
          </div>
          <div className="flex items-center gap-3">
            <ArrowUp className="w-6 h-6 text-purple-500" />
            <span><strong>Centralized control</strong> - Your subreddit, your rules</span>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-gradient-to-r from-red-50 to-purple-50 rounded-xl p-4 border-2 border-dashed border-red-300">
        <div className="text-lg font-bold text-gray-800 mb-3">
          ⚖️ Judgment Awaits
        </div>
        <div className="space-y-2 text-sm">
          <div className="bg-green-100 p-2 rounded border-l-4 border-green-500">
            <strong>Worthy:</strong> "This post follows all guidelines perfectly"
          </div>
          <div className="bg-red-100 p-2 rounded border-l-4 border-red-500">
            <strong>Unworthy:</strong> "Slightly off-topic? BANISHED!"
          </div>
          <div className="bg-yellow-100 p-2 rounded border-l-4 border-yellow-500">
            <strong>Gray Area:</strong> "First!" (Low effort - PURGE IT!)
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
      >
        <Play className="w-6 h-6" />
        Begin the Purge
      </button>

      {/* High Score */}
      {highScore > 0 && (
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">Most Bans Issued: {highScore.toLocaleString()}</span>
        </div>
      )}

      {/* Flavor Text */}
      <div className="text-sm text-gray-500 italic">
        "With great power comes great responsibility... or absolute corruption." - r/modquotes
      </div>
    </div>
  );
};

export default StartScreen;