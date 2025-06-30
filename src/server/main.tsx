import { Devvit, useWebView } from "@devvit/public-api";
import type { DevvitMessage, WebViewMessage } from "./message.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: "HungryMod Karma Game",
  height: "tall",
  render: (context) => {
    const { mount } = useWebView<WebViewMessage, DevvitMessage>({
      url: "page.html",
      async onMessage(message, webView) {
        console.log("Received message from web view:", message);
        
        switch (message.type) {
          case 'webViewReady':
            console.log("Web view is ready");
            // Send initial data if needed
            webView.postMessage({
              type: 'initialData',
              data: { 
                username: context.userId || 'anonymous',
                gameReady: true 
              }
            });
            break;
            
          case 'saveHighScore':
            try {
              const key = `highscore:${context.userId}`;
              await context.redis.set(key, message.data.score.toString());
              console.log(`Saved high score: ${message.data.score}`);
            } catch (error) {
              console.error("Failed to save high score:", error);
            }
            break;
            
          case 'getHighScore':
            try {
              const key = `highscore:${context.userId}`;
              const highScore = await context.redis.get(key);
              webView.postMessage({
                type: 'highScoreData',
                data: { highScore: parseInt(highScore || '0') }
              });
            } catch (error) {
              console.error("Failed to get high score:", error);
            }
            break;
        }
      },
      onUnmount() {
        console.log("Web view unmounted");
      },
    });

    return (
      <vstack grow padding="small">
        <vstack grow alignment="middle center">
          <text size="large" weight="bold" color="primary">
            🎮 HungryMod Karma
          </text>
          <spacer size="medium" />
          <text size="medium" alignment="center">
            Moderate comments as they flood in! 
            Approve the good ones, delete the trolls.
          </text>
          <spacer size="large" />
          <button 
            onPress={mount}
            appearance="primary"
            size="large"
          >
            🚀 Launch Game
          </button>
        </vstack>
      </vstack>
    );
  },
});

Devvit.addMenuItem({
  label: "Create HungryMod Game Post",
  location: "subreddit",
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      const post = await reddit.submitPost({
        title: "🎮 HungryMod Karma - Can You Handle The Comment Chaos?",
        subredditName: subreddit.name,
        preview: (
          <vstack height="100%" width="100%" alignment="middle center">
            <text size="large" weight="bold">🎮 Loading HungryMod Karma...</text>
            <spacer size="medium" />
            <text size="medium">Get ready to moderate comments!</text>
          </vstack>
        ),
      });
      ui.showToast({ text: "Game post created!" });
      ui.navigateTo(post);
    } catch (err) {
      console.error("Failed to create post:", err);
      ui.showToast({ text: "Failed to create post" });
    }
  },
});

export default Devvit;