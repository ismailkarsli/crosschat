type EventType = "chatMessage";

export interface ChatMessage {
  text: string;
  author: string;
  date: string;
}

export class ServiceEmitter {
  private events: { [key in EventType]: Function[] } = {
    chatMessage: [],
  };

  on(event: "chatMessage", callback: (message: ChatMessage) => void): void;
  on(event: EventType, callback: (data: any) => void): void {
    this.events[event].push(callback);
  }

  protected emit(event: "chatMessage", message: ChatMessage): void;
  protected emit(event: EventType, data: object) {
    this.events[event].forEach((callback) => {
      callback(data);
    });
  }
}
