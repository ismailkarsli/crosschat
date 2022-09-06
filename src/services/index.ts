import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

export enum ServiceName {
  Twitch = "twitch",
  Youtube = "youtube",
  Dlive = "dlive",
}

type Events = {
  chatMessage: (message: ChatMessage) => void;
};

export type ServiceStatus = "connected" | "disconnected";

export abstract class ServiceEmitter extends (EventEmitter as new () => TypedEmitter<Events>) {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract sendMessage(message: string): Promise<void>;
  abstract status: ServiceStatus;
}
