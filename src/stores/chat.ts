import { defineStore } from "pinia";
import Dlive from "../services/dlive";
import Twitch from "../services/twitch";
import Youtube from "../services/youtube";

interface ChatState {
  twitch: {
    connected: boolean;
    channelName?: string;
    client?: Twitch;
  };
  youtube: {
    connected: boolean;
    channelId?: string;
    client?: Youtube;
  };
  dlive: {
    connected: boolean;
    username?: string;
    client?: Dlive;
  };

  messages: ChatMessage[];
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => {
    return {
      twitch: {
        connected: false,
      },
      youtube: {
        connected: false,
      },
      dlive: {
        connected: false,
      },

      messages: [],
    };
  },

  actions: {
    async connectTwitch() {
      if (!this.twitch.channelName) {
        throw new Error("Channel name is required");
      }
      this.twitch.client = new Twitch(this.twitch.channelName);
      await this.twitch.client.connect();
      this.twitch.connected = true;

      this.twitch.client.on("chatMessage", (message) => {
        this.messages.push(message);
      });
    },

    async connectYoutube() {
      if (!this.youtube.channelId) {
        throw new Error("Channel ID is required");
      }
      this.youtube.client = new Youtube(this.youtube.channelId);
      await this.youtube.client.connect();
      this.youtube.connected = true;

      this.youtube.client.on("chatMessage", (message) => {
        this.messages.push(message);
      });
    },
    async connectDlive() {
      if (!this.dlive.username) {
        throw new Error("Username is required");
      }
      this.dlive.client = new Dlive(this.dlive.username);
      await this.dlive.client.connect();
      this.dlive.connected = true;

      this.dlive.client.on("chatMessage", (message) => {
        this.messages.push(message);
      });
    },
  },
});
