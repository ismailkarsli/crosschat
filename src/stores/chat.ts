import { defineStore } from "pinia";
import Twitch from "../services/twitch";
import Youtube from "../services/youtube";
import Dlive from "../services/dlive";
import { Store } from "tauri-plugin-store-api";

const store = new Store(".settings.dat");

interface State {
  twitchUsername?: string;
  youtubeChannelId?: string;
  dliveUsername?: string;

  twitchClient?: Twitch;
  youtubeClient?: Youtube;
  dliveClient?: Dlive;

  messages: ChatMessage[];
}

export const useChatStore = defineStore("chat", {
  state: (): State => {
    return {
      twitchUsername: "",
      youtubeChannelId: "",
      dliveUsername: "",

      twitchClient: undefined,
      youtubeClient: undefined,
      dliveClient: undefined,

      messages: [],
    };
  },

  actions: {
    async init() {
      const twitchUsername = await store.get("twitchUsername");
      const youtubeChannelId = await store.get("youtubeChannelId");
      const dliveUsername = await store.get("dliveUsername");

      if (twitchUsername) this.loadTwitch(twitchUsername as string);
      if (youtubeChannelId) this.loadYoutube(youtubeChannelId as string);
      if (dliveUsername) this.loadDlive(dliveUsername as string);
    },

    async loadTwitch(username: string | undefined) {
      if (this.twitchClient) {
        await this.twitchClient.disconnect();
      }
      this.twitchUsername = username;
      store.set("twitchUsername", username);

      if (!username) return;
      this.twitchClient = new Twitch(username);
      await this.twitchClient.connect();
      this.twitchClient.on("chatMessage", this.addMessage);
    },

    async loadYoutube(channelId: string | undefined) {
      if (this.youtubeClient) {
        await this.youtubeClient.disconnect();
      }
      this.youtubeChannelId = channelId;
      store.set("youtubeChannelId", channelId);

      if (!channelId) return;
      this.youtubeClient = new Youtube(channelId);
      await this.youtubeClient.connect();
      this.youtubeClient.on("chatMessage", this.addMessage);
    },
    async loadDlive(username: string | undefined) {
      if (this.dliveClient) {
        await this.dliveClient.disconnect();
      }
      this.dliveUsername = username;
      store.set("dliveUsername", username);

      if (!username) return;
      this.dliveClient = new Dlive(username);
      await this.dliveClient.connect();
      this.dliveClient.on("chatMessage", this.addMessage);
    },

    addMessage(message: ChatMessage) {
      this.messages.push(message);
    },
  },
});
