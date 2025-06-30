import { useState, useEffect, useCallback } from 'react';
import { GameState, GameObject } from '../types/game';

const GAME_DURATION = 30; // seconds

const COMMENT_TEMPLATES = {
  good: [
    { text: "This is hilarious! 😂", username: "r/funny" },
    { text: "Take my upvote!", username: "r/all" },
    { text: "LMAO this made my day", username: "u/LaughTrackLive" },
    { text: "Quality content right here", username: "u/UpvoteEngineer" },
    { text: "This deserves gold!", username: "u/KarmaInvestor" },
    { text: "Saving this post", username: "u/BookmarkGoblin" },
    { text: "Best meme I've seen today", username: "u/MemeSurgeon" },
    { text: "You win the internet today", username: "u/WinnerOfWeb" }
  ],
  helpful: [
    { text: "Summarized it better than OP", username: "u/SummaryBot9000" },
    { text: "Great explanation, thanks!", username: "u/ClarityPlease" },
    { text: "This helped me a lot!", username: "u/RealLearner" },
    { text: "TIL something new!", username: "r/todayilearned" },
    { text: "OP, you might want to check this:", username: "u/ExtraContext" },
    { text: "Fantastic point!", username: "u/ThinkDeeper" },
    { text: "Very insightful.", username: "u/ThreadPhilosopher" }
  ],
  bad: [
    { text: "This is stupid and you're dumb", username: "u/NoBrainGang" },
    { text: "Cringe af delete this", username: "u/CringePolice" },
    { text: "Nobody asked", username: "u/SilentMajority" },
    { text: "“I feel bad for you, must be hard being this stupid.”", username: "u/KarenOfReddit" },
    { text: "You're what's wrong with Reddit", username: "u/GatekeepingElite" },
    { text: "Don't take your meds, big pharma just wants you addicted", username: "r/conspiracy" },
    { text: "Kill yourself", username: "u/EdgeMax2000" }
  ],
  tricky: [
    { text: "First!", username: "u/RefreshSniper" },
    { text: "This.", username: "u/EchoBot77" },
    { text: "Came here to say this", username: "u/MindReader77" },
    { text: "Underrated comment", username: "u/KarmaWhale" },
    { text: "Edit: Thanks for the gold, kind stranger!", username: "u/AwardBait" },
    { text: "Username checks out", username: "r/me_irl" }
  ],
  troll: [
    { text: "Poor people are just lazy, sorry not sorry", username: "r/unpopularopinion" },
    { text: "Vaccines are government mind control", username: "r/conspiracy" },
    { text: "Trans rights? More like mental illness rights", username: "u/TERFlogic101" },
    { text: "Why do women even talk in tech threads?", username: "u/BrogrammerAlpha" },
    { text: "Elon Musk > your entire bloodline", username: "u/MuskCultist" },
    { text: "You're all just NPCs anyway", username: "u/MatrixAwakened" },
    { text: "Flat Earth makes more sense than NASA's lies", username: "u/GlobeDenier" },
    { text: "Literally Hitler was misunderstood", username: "u/AltHistoryFan" },
    { text: "“Trans people are mentally ill. Prove me wrong.”", username: "u/JustAskingQuestions" },
    { text: "Reddit is full of brainwashed soyboys", username: "u/MeatPill" }
  ],
  spam: [
    { text: "Check out my new crypto coin!", username: "u/CoinDropDev" },
    { text: "FREE V-BUCKS HERE -> [dodgy.link]", username: "u/VbucksMaster" },
    { text: "My onlyfans is better", username: "u/ThirstTrapBot" },
    { text: "Subscribe to my channel!", username: "u/CloutHunterYT" },
    { text: "!!!!!! CLICK HERE !!!!!!", username: "u/ClickStorm" },
    { text: "Nice post, visit my profile for more", username: "u/PromoWizard" },
    { text: "Earn $5000/month with this ONE trick!", username: "u/WealthHackers" },
    { text: "Join our Discord to get free skins!", username: "u/SkinDropHype" },
    { text: "I made $2,000 in a day from this site", username: "u/HustleGuru" },
    { text: "DM me for a business opportunity", username: "u/DM4Success" }
  ]
};


export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 0,
    timeLeft: GAME_DURATION,
    gameObjects: [],
    powerUps: {
      modProtection: false,
      cakeDay: 0
    },
    gameStatus: 'waiting',
    highScore: parseInt(localStorage.getItem('redditModHighScore') || '0'),
    postKarma: 1
  });

  // Game loop for moving objects and spawning new ones
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        // Move objects down
        const updatedObjects = prev.gameObjects
          .map(obj => ({ ...obj, y: obj.y + obj.speed }))
          .filter(obj => obj.y < 110); // Remove objects that fell off screen

        // Spawn new objects
        const shouldSpawn = Math.random() < 0.3;
        let newObjects = [...updatedObjects];
        
        if (shouldSpawn) {
          const newObject = createRandomComment();
          newObjects.push(newObject);
        }

        return {
          ...prev,
          gameObjects: newObjects
        };
      });
    }, 80);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStatus]);

  // Timer countdown
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          return { ...prev, timeLeft: 0, gameStatus: 'ended' };
        }
        return { 
          ...prev, 
          timeLeft: newTimeLeft,
          powerUps: {
            ...prev.powerUps,
            cakeDay: Math.max(0, prev.powerUps.cakeDay - 1)
          }
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  // Save high score based on postKarma instead of score
  useEffect(() => {
    if (gameState.gameStatus === 'ended' && gameState.postKarma > gameState.highScore) {
      localStorage.setItem('redditModHighScore', gameState.postKarma.toString());
      setGameState(prev => ({ ...prev, highScore: gameState.postKarma }));
    }
  }, [gameState.gameStatus, gameState.postKarma, gameState.highScore]);

  const createRandomComment = (): GameObject => {
    const types: GameObject['type'][] = [
      'good-comment', 'good-comment', 'good-comment', 'good-comment',  // 4x weight
      'helpful-comment', 'helpful-comment',                           // 2x weight
      'bad-comment', 'bad-comment', 'bad-comment',                    // 3x weight
      'spam-bot', 'spam-bot',                                        // 2x weight
      'repost',                                                      // 1x weight
      'gold-award',
      'mod-warning',
      'cake-day',
      'rickroll'
    ];
    
    // The total weights are: good-comment: 4/15 (26.7%) helpful-comment: 2/15 (13.3%) bad-comment: 3/15 (20%) spam-bot: 2/15 (13.3%) All others: 1/15 (6.7% each)
    const type = types[Math.floor(Math.random() * types.length)];

    let text = '';
    let points = 0;
    let username = '';

    
    switch (type) {
      case 'good-comment':
        text = COMMENT_TEMPLATES.good[Math.floor(Math.random() * COMMENT_TEMPLATES.good.length)].text;
        points = -5; // Click to approve
        username = COMMENT_TEMPLATES.good[Math.floor(Math.random() * COMMENT_TEMPLATES.good.length)].username;
        break;  
      case 'helpful-comment':
        text = COMMENT_TEMPLATES.helpful[Math.floor(Math.random() * COMMENT_TEMPLATES.helpful.length)].text;
        points = -10; // Click to approve, more valuable
        username = COMMENT_TEMPLATES.helpful[Math.floor(Math.random() * COMMENT_TEMPLATES.helpful.length)].username;
        break;
      case 'bad-comment':
        text = COMMENT_TEMPLATES.bad[Math.floor(Math.random() * COMMENT_TEMPLATES.bad.length)].text;
        points = 10; // Click to DELETE (positive points for correct action)
        username = COMMENT_TEMPLATES.bad[Math.floor(Math.random() * COMMENT_TEMPLATES.bad.length)].username;
        break;
      case 'spam-bot':
        text = COMMENT_TEMPLATES.spam[Math.floor(Math.random() * COMMENT_TEMPLATES.spam.length)].text;
        points = 7; // Click to DELETE (positive points)
        username = COMMENT_TEMPLATES.spam[Math.floor(Math.random() * COMMENT_TEMPLATES.spam.length)].username;
        break;
      case 'repost':
        text = "I've seen this before... pretty sure it's a repost.";
        points = 3; // Click to DELETE (low effort)
        username = `u/ReposterPatrol${Math.floor(Math.random()*100)}`;
        break;
      case 'gold-award':
        text = "Someone gave you Gold! Thanks for the Gold Kind Stranger!";
        points = 5; // Click to accept/acknowledge
        username = 'Reddit Gold!'; 
        break;
      case 'mod-warning':
        text = "MOD WARNING: Rule violation detected in comments!";
        points = 25; // Click ONLY IF PROTECTED. This is the penalty for clicking unprotected.
        username = 'r/Mods'; 
        break;
      case 'cake-day':
        text = "Happy Cake Day! Here's a power-up!";
        points = 0; // The power-up is the reward, small score bonus in catchObject.
        username = `u/YourCakeDayAlt${Math.floor(Math.random()*100)}`;
        break;
      case 'rickroll':
        text = COMMENT_TEMPLATES.troll[Math.floor(Math.random() * COMMENT_TEMPLATES.good.length)].text;
        points = 3; // Click to DELETE (annoying but low impact)
        username = COMMENT_TEMPLATES.troll[Math.floor(Math.random() * COMMENT_TEMPLATES.good.length)].username;
        break;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 70 + 15, // 15% to 85% from left
      y: -5,
      type, 
      speed: 1.5 + Math.random() * 1,
      points,
      text,
      username
    };
  };

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      combo: 0,
      timeLeft: GAME_DURATION,
      gameObjects: [],
      powerUps: {
        modProtection: false,
        cakeDay: 0
      },
      gameStatus: 'playing',
      postKarma: 1
    }));
  }, []);

  const catchObject = useCallback((objectId: string) => {
    setGameState(prev => {
      const object = prev.gameObjects.find(obj => obj.id === objectId);
      if (!object) return prev;

      const updatedObjects = prev.gameObjects.filter(obj => obj.id !== objectId); //remove object after clicked

      let newScore = prev.score + 1; // Always increment score by 1
      let newCombo = prev.combo;
      let newPowerUps = { ...prev.powerUps };
      let newPostKarma = prev.postKarma;

      // Handle different comment types in a more readable structure
      let pointsToAdd = object.points;
      
      // Double points during cake day for all clicked objects
      if (prev.powerUps.cakeDay > 0) {
        pointsToAdd = object.points * 2;
      }
      
      switch (object.type) {
        case 'good-comment': {
          newCombo = prev.combo + 1;
          newPowerUps.modProtection = true; // Good comment gives mod protection
          const multiplier = Math.min(Math.floor(newCombo / 3) + 1, 5); // Cap at 5x
          newPostKarma = prev.postKarma + pointsToAdd * multiplier;
          break;
        }
        case 'gold-award': {
          newPostKarma = prev.postKarma + pointsToAdd;
          newPowerUps.modProtection = true; // Gold gives mod protection
          break;
        }
        case 'cake-day': {
          newPowerUps.cakeDay = 5; // 5 seconds of auto-moderation
          newPostKarma = prev.postKarma + 10;
          break;
        }
        case 'bad-comment':
        case 'repost':
        case 'mod-warning':
        case 'rickroll': {
          if (prev.powerUps.modProtection) {
            newPowerUps.modProtection = false; // Use up the protection
          } else {
            newCombo = 0; // Break combo
            newPostKarma = Math.max(1, prev.postKarma + pointsToAdd * 2);
          }
          break;
        }
        // Add more cases here if needed for other types
        default:
          // No special handling for other types
          break;
      }

      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        gameObjects: updatedObjects,
        powerUps: newPowerUps,
        postKarma: newPostKarma
      };
    });
  }, []);

  const shareScore = useCallback(() => {
    const modRank = gameState.postKarma >= 1000 ? "Reddit Legend" :
                   gameState.postKarma >= 500 ? "Super Moderator" :
                   gameState.postKarma >= 250 ? "Good Moderator" :
                   gameState.postKarma >= 100 ? "Learning Mod" :
                   gameState.postKarma >= 50 ? "Rookie Mod" : "Chaos Creator";

    const shareText = `🎮 I just survived Reddit Post Panic! My post hit the front page and I moderated ${gameState.score} comments, earning the rank "${modRank}"! 📱\n\nMy post ended with ${gameState.postKarma.toLocaleString()} karma. Can you handle the chaos better than me? #RedditPostPanic`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Reddit Post Panic Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard! Share your chaos management skills!');
    }
  }, [gameState.score, gameState.postKarma]);

  return {
    gameState,
    startGame,
    catchObject,
    shareScore
  };
};