import { ServiceEmitter } from ".";
import axios from "axios";
import dayjs from "../plugins/dayjs";
import { LiveChat } from "youtube-chat";

/* Streamelements example
https://accounts.google.com/o/oauth2/v2/auth/identifier
?client_id=722996816243-m2seibvttl7lc2g4qhajjdlrikjlv4uj.apps.googleusercontent.com
&response_type=code
&scope=https://www.googleapis.com/auth/youtube+https://www.googleapis.com/auth/youtube.readonly+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/youtube.upload+https://www.googleapis.com/auth/youtube.channel-memberships.creator&redirect_uri=https://api.streamelements.com/auth/youtube/callback&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiJhZGRDaGFubmVsIiwidXNlcklkIjoiNjJkZmYyYmZkNmFkNjVkNDU1Y2Y4YzczIiwicmV0dXJuVXJsIjoiaHR0cHM6Ly9zdHJlYW1lbGVtZW50cy5jb20vZGFzaGJvYXJkL2FjY291bnQvY2hhbm5lbHMiLCJjc3JmIjoiMjU2YzdhYjRmZTE3NDY3M2VmMGIyNDdlMjQ5NmRmMWYiLCJpYXQiOjE2NjA0OTAzMTAsImV4cCI6MTY2MDQ5MDYxMH0.ylej0Ot1PTu_JsCnSD5aiJn2_auIpU0SIwZiT6YNsF4&access_type=offline&prompt=select_account&flowName=GeneralOAuthFlow
*/

interface YoutubeChatMessage {
  id: string;
  snippet: {
    displayMessage: string;
    publishedAt: string;
  };
  authorDetails: {
    displayName: string;
    channelId: string;
  };
}

export default class Youtube extends ServiceEmitter {
  private client!: LiveChat;
  private liveChatId!: string;
  constructor() {
    super();
  }

  static async init(opts: { channelId: string }) {
    const instance = new Youtube();
    instance.client = new LiveChat({ channelId: opts.channelId });
    instance.client.on("chat", (chat) => {
      if (
        dayjs(chat.timestamp).add(1, "minute").isBefore(dayjs()) ||
        chat.author.channelId === process.env.GOOGLE_BOT_CHANNEL_ID
      )
        return;
      instance.emit("chatMessage", {
        author: chat.author.name,
        text: chat.message
          .reduce((acc, msg) => {
            if ("text" in msg) acc.push(msg.text);
            else if ("emojiText" in msg) acc.push(msg.emojiText);
            return acc;
          }, [] as string[])
          .join(" "),
        date: chat.timestamp.toISOString(),
      });
    });
    await instance.client.start();
    const streamingDetails = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "liveStreamingDetails",
          id: instance.client.liveId,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    instance.liveChatId =
      streamingDetails.data?.items?.[0]?.liveStreamingDetails?.activeLiveChatId;

    return instance;
  }

  async sendMessage(message: string) {
    await axios
      .post(
        "https://www.googleapis.com/youtube/v3/liveChat/messages",
        {
          snippet: {
            type: "textMessageEvent",
            liveChatId: this.liveChatId,
            textMessageDetails: {
              messageText: message,
            },
          },
        },
        {
          params: {
            part: "snippet",
            key: process.env.GOOGLE_API_KEY,
          },
          headers: {
            Authorization: `Bearer ${process.env.GOOGLE_OAUTH_TOKEN}`,
          },
        }
      )
      .catch((e) => {
        console.log(e);
      });
  }
}

/*

  private lastMessageDate = dayjs();
  private pollingInterval: number = 0;
  private pageToken: string | null = null;
  private liveChatId: string | null = null;
  private channelId: string | null = null;

  
    const liveVideos = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: opts.channelId,
          type: "video",
          eventType: "live",
          access_token: process.env.GOOGLE_OAUTH_TOKEN,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );
    const video = liveVideos.data.items?.[0];
    if (!video) {
      throw new Error("No live video found");
    }
    const videoId = video?.id?.videoId;
    const streamingDetails = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "liveStreamingDetails",
          id: videoId,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    instance.liveChatId =
      streamingDetails.data?.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
    instance.channelId = opts.channelId;

    if (!instance.liveChatId) {
      throw new Error("No live chat found");
    }

      const poll = async () => {
      await instance.fetch();
      await new Promise((resolve) =>
        setTimeout(resolve, instance.pollingInterval)
      );
      poll();
    };
    poll();

async fetch() {
    const chat = await axios.get(
      "https://www.googleapis.com/youtube/v3/liveChat/messages",
      {
        params: {
          liveChatId: this.liveChatId,
          part: "snippet,authorDetails",
          key: process.env.GOOGLE_API_KEY,
          pageToken: this.pageToken,
        },
      }
    );

    this.pageToken = chat.data.nextPageToken;
    this.pollingInterval = chat.data.pollingIntervalMillis;
    chat.data.items.forEach((item: YoutubeChatMessage) => {
      if (
        dayjs(item.snippet.publishedAt).isAfter(this.lastMessageDate) &&
        item.authorDetails.channelId !== process.env.GOOGLE_BOT_CHANNEL_ID
      ) {
        this.emit("chatMessage", {
          author: item.authorDetails.displayName,
          text: item.snippet.displayMessage,
          date: dayjs(item.snippet.publishedAt).format(),
        });
        this.lastMessageDate = dayjs(item.snippet.publishedAt);
      }
    });
  }
    */
