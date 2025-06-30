import { Devvit, useWebView } from "@devvit/public-api";
import type { DevvitMessage, WebViewMessage } from "./message.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: "lets Hack!",
  height: "tall",
  render: (context) => {
    // Example: load game.html as the webview
    const { mount } = useWebView<WebViewMessage, DevvitMessage>({
      url: "page.html",
      async onMessage(message, webView) {
        // Handle messages here if needed
      },
      onUnmount() {
        context.ui.showToast("Web view closed!");
      },
    });
    // Example UI with a launch button
    return (
      <vstack grow padding="small">
        <vstack grow alignment="middle center">
          <button onPress={mount}>Launch App</button>
        </vstack>
      </vstack>
    );
  },
});

Devvit.addMenuItem({
  label: "Create New Devvit Post (with Web View)",
  location: "subreddit",
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      const post = await reddit.submitPost({
        title: "Hungry mods",
        subredditName: subreddit.name,
        // The preview appears while the post loads
        preview: (
          <vstack height="100%" width="100%" alignment="middle center">
            <text size="large">Loading ...</text>
          </vstack>
        ),
      });
      ui.showToast({ text: "Created post!" });
      ui.navigateTo(post);
    } catch (err) {
      ui.showToast({ text: "Failed to create post" });
    }
  },
});

export default Devvit;
