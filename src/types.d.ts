declare module "axios/lib/core/settle";

interface ChatMessage {
  text: string;
  author: string;
  date: string;
  service: import("./services").ServiceName;
}
