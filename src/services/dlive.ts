import axios from "axios";
import axiosTauriAdapter from "axios-tauri-adapter";
import { ServiceEmitter, ServiceName } from ".";
import dayjs from "../plugins/dayjs";

interface DliveChatMessage {
  content: string;
  createdAt: string;
  sender: {
    username: string;
  };
}

export default class Dlive extends ServiceEmitter {
  private username: string;
  private interval!: NodeJS.Timeout;
  private lastFetchDate = dayjs();

  constructor(username: string) {
    super();
    this.username = username;
  }
  async connect() {
    this.interval = setInterval(async () => {
      const chatroom = await axios.post(
        "https://graphigo.prd.dlive.tv",
        {
          query: `query { 
            userByDisplayName(displayname: "${this.username}") {
              chats(count: 5) {
                ... on ChatText {
                  content
                  createdAt
                  sender {
                    username
                  }
                }
              }
            }
          }`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          adapter: axiosTauriAdapter,
        }
      );

      const chats = chatroom.data.data.userByDisplayName.chats;

      chats.forEach((chat: DliveChatMessage) => {
        // 19 digit nanoseconds timestamp
        const date = dayjs(Number(chat.createdAt) / 1000000);

        if (dayjs(date).isAfter(this.lastFetchDate)) {
          this.emit("chatMessage", {
            text: chat.content,
            author: chat.sender.username,
            date: date.toISOString(),
            service: ServiceName.Dlive,
          });
        }
      });

      this.lastFetchDate = dayjs();
    }, 2000);
  }

  async disconnect() {
    clearInterval(this.interval);
  }

  async sendMessage(message: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
