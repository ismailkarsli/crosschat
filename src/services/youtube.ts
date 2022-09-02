import { ServiceEmitter, ServiceName } from ".";
import dayjs from "../plugins/dayjs";
import { LiveChat } from "youtube-chat";
import axios from "axios";
import axiosTauriAdapter from "../plugins/axios-tauri-adapter";

const { GOOGLE_API_KEY, GOOGLE_OAUTH_TOKEN } = import.meta.env;

/* Streamelements example
https://accounts.google.com/o/oauth2/v2/auth/identifier
?client_id=722996816243-m2seibvttl7lc2g4qhajjdlrikjlv4uj.apps.googleusercontent.com
&response_type=code
&scope=https://www.googleapis.com/auth/youtube+https://www.googleapis.com/auth/youtube.readonly+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/youtube.upload+https://www.googleapis.com/auth/youtube.channel-memberships.creator&redirect_uri=https://api.streamelements.com/auth/youtube/callback&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiJhZGRDaGFubmVsIiwidXNlcklkIjoiNjJkZmYyYmZkNmFkNjVkNDU1Y2Y4YzczIiwicmV0dXJuVXJsIjoiaHR0cHM6Ly9zdHJlYW1lbGVtZW50cy5jb20vZGFzaGJvYXJkL2FjY291bnQvY2hhbm5lbHMiLCJjc3JmIjoiMjU2YzdhYjRmZTE3NDY3M2VmMGIyNDdlMjQ5NmRmMWYiLCJpYXQiOjE2NjA0OTAzMTAsImV4cCI6MTY2MDQ5MDYxMH0.ylej0Ot1PTu_JsCnSD5aiJn2_auIpU0SIwZiT6YNsF4&access_type=offline&prompt=select_account&flowName=GeneralOAuthFlow
*/

export default class Youtube extends ServiceEmitter {
  private ytClient!: LiveChat;
  // private liveChatId!: string;
  constructor(channelId: string) {
    super();
    this.ytClient = new LiveChat({
      channelId,
      axiosInstance: axios.create({ adapter: axiosTauriAdapter }),
    });

    this.ytClient.on("comment", (chat) => {
      if (
        dayjs(chat.timestamp).add(1, "minute").isBefore(dayjs())
        // || chat.author.channelId === GOOGLE_BOT_CHANNEL_ID
      )
        return;
      this.emit("chatMessage", {
        author: chat.author.name,
        text: chat.message
          .reduce((acc, msg) => {
            console.log(msg);
            if ("text" in msg) acc.push(msg.text);
            // else if ("emojiText" in msg) acc.push(msg.emojiText);
            return acc;
          }, [] as string[])
          .join(" "),
        date: dayjs(chat.timestamp).toISOString(),
        service: ServiceName.Youtube,
      });
    });
  }

  async connect() {
    const ok = await this.ytClient.start();
    if (!ok) {
      throw new Error("Could not connect to youtube");
    }
    // const streamingDetails = await axios.get(
    //   "https://www.googleapis.com/youtube/v3/videos",
    //   {
    //     params: {
    //       part: "liveStreamingDetails",
    //       id: this.ytClient.liveId,
    //       key: GOOGLE_API_KEY,
    //     },
    //   }
    // );

    // this.liveChatId =
    //   streamingDetails.data?.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
  }

  async sendMessage(message: string) {
    throw new Error("Method not implemented.");
    //   await axios
    //     .post(
    //       "https://www.googleapis.com/youtube/v3/liveChat/messages",
    //       {
    //         snippet: {
    //           type: "textMessageEvent",
    //           liveChatId: this.liveChatId,
    //           textMessageDetails: {
    //             messageText: message,
    //           },
    //         },
    //       },
    //       {
    //         params: {
    //           part: "snippet",
    //           key: GOOGLE_API_KEY,
    //         },
    //         headers: {
    //           Authorization: `Bearer ${GOOGLE_OAUTH_TOKEN}`,
    //         },
    //       }
    //     )
    //     .catch((e) => {
    //       console.log(e);
    //     });
  }
}
