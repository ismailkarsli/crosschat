import tmi, { Client } from "tmi.js";
import { ServiceEmitter, ServiceName, ServiceStatus } from ".";
import dayjs from "../plugins/dayjs";

const { TWITCH_BOT_USERNAME, TWITCH_BOT_ACCESS_TOKEN } = import.meta.env;

/* Streamelements example
https://id.twitch.tv/oauth2/authorize
?client_id=9uavest5z7knsvpbip19fxqkywxz3ec
&response_type=code
&scope=user:read:email+user:read:broadcast+channel:manage:broadcast+channel:read:redemptions+chat:read+channel:moderate+bits:read+channel_subscriptions+channel:read:subscriptions+channel:manage:predictions+channel:manage:polls+channel:edit:commercial
&redirect_uri=https%3A%2F%2Fapi.streamelements.com%2Fauth%2Ftwitch%2Fcallback
&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXR1cm5VcmwiOiJodHRwczovL3N0cmVhbWVsZW1lbnRzLmNvbS9kYXNoYm9hcmQiLCJwbGF0Zm9ybSI6IndlYiIsInJlZmVyZXIiOiJodHRwczovL3N0cmVhbWVsZW1lbnRzLmNvbS8iLCJ1c2VyRmxvdyI6InN0cmVhbWVyIiwiY3NyZiI6ImUzNjFkNmU2ODM1Mzg5YmQ1M2U0OWQzNDZhM2NmNThkIiwiaWF0IjoxNjYwNDg5MDIzLCJleHAiOjE2NjA0ODkzMjN9.zgBib4ml98sHd-iY4o7ZGJB20PrTQA4fsGx6iCfsnMk
*/
export default class Twitch extends ServiceEmitter {
  private tmiClient: Client | undefined;
  private channelName!: string;
  public status: ServiceStatus = "disconnected";

  constructor(channelName: string) {
    super();

    this.channelName = channelName;
    this.tmiClient = new tmi.Client({
      options: {},
      identity: {
        username: TWITCH_BOT_USERNAME,
        password: `oauth:${TWITCH_BOT_ACCESS_TOKEN}`,
      },
      channels: [channelName],
    });

    this.tmiClient.on("message", (channel, tags, message, self) => {
      // if (self) return;
      this.emit("chatMessage", {
        author: tags["display-name"] || tags.username || "[no-username]",
        text: message,
        date: tags["tmi-sent-ts"]
          ? dayjs(tags["tmi-sent-ts"]).format()
          : dayjs().format(),
        service: ServiceName.Twitch,
      });
    });
  }

  async connect() {
    if (!this.tmiClient) throw new Error("TMI client not initialized");
    await this.tmiClient.connect();
    this.status = "connected";
  }

  async disconnect() {
    if (!this.tmiClient) throw new Error("TMI client not initialized");
    await this.tmiClient.disconnect();
    this.status = "disconnected";
  }

  async sendMessage(message: string) {
    if (!this.tmiClient) return;
    this.tmiClient.say(this.channelName, message);
  }
}
