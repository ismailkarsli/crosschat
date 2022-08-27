import { createClient } from "graphqurl";

// Not ready yet
const client = createClient({
  endpoint: "https://graphigo.prd.dlive.tv/", // "https://api.dlive.tv",
  headers: {
    authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVrc2kiLCJkaXNwbGF5bmFtZSI6ImVrc2kiLCJhdmF0YXIiOiJodHRwczovL2ltYWdlcy5wcmQuZGxpdmVjZG4uY29tL2F2YXRhci9kZWZhdWx0MjMucG5nIiwicGFydG5lcl9zdGF0dXNfc3RyaW5nIjoiTk9ORSIsImlkIjoiIiwibGlkIjowLCJ0eXBlIjoiZW1haWwiLCJyb2xlIjoiTm9uZSIsIm9hdXRoX2FwcGlkIjoiIiwiZXhwIjoxNjY0MjE0MDQ2LCJpYXQiOjE2NjE1MzU2NDYsImlzcyI6IkRMaXZlIn0.d3u3jVNDVa9rhbdz9uwb_TY5Q4Bmbs7JFBwDcQpqkfc",
  },
  websocket: {
    endpoint: "wss://graphigostream.prd.dlive.tv", // "wss://api-ws.dlive.tv",
    onConnectionSuccess: () => console.log("Connected"),
    onConnectionError: (e: any) => console.log("Connection error: ", e),
    parameters: {
      // authorization:
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVrc2kiLCJkaXNwbGF5bmFtZSI6ImVrc2kiLCJhdmF0YXIiOiJodHRwczovL2ltYWdlcy5wcmQuZGxpdmVjZG4uY29tL2F2YXRhci9kZWZhdWx0MjMucG5nIiwicGFydG5lcl9zdGF0dXNfc3RyaW5nIjoiTk9ORSIsImlkIjoiIiwibGlkIjowLCJ0eXBlIjoiZW1haWwiLCJyb2xlIjoiTm9uZSIsIm9hdXRoX2FwcGlkIjoiIiwiZXhwIjoxNjY0MjE0MDQ2LCJpYXQiOjE2NjE1MzU2NDYsImlzcyI6IkRMaXZlIn0.d3u3jVNDVa9rhbdz9uwb_TY5Q4Bmbs7JFBwDcQpqkfc",
    },
  },
});

client.query({
  query: 'subscription{streamMessageReceived(streamer:"eksi"){__typename}}',
});

client.subscribe(
  {
    subscription:
      'subscription{streamMessageReceived(streamer:"eksi"){__typename}}',
    // subscription:
    //   "subscription StreamMessageSubscription($streamer: String!) {\n  streamMessageReceived(streamer: $streamer) {\n    type\n    ... on ChatGift {\n      id\n      gift\n      amount\n      message\n      recentCount\n      expireDuration\n      ...VStreamChatSenderInfoFrag\n      __typename\n    }\n    ... on ChatHost {\n      id\n      viewer\n      ...VStreamChatSenderInfoFrag\n      __typename\n    }\n    ... on ChatSubscription {\n      id\n      month\n      ...VStreamChatSenderInfoFrag\n      __typename\n    }\n    ... on ChatExtendSub {\n      id\n      month\n      length\n      ...VStreamChatSenderInfoFrag\n      __typename\n    }\n    ... on ChatChangeMode {\n      mode\n      __typename\n    }\n    ... on ChatText {\n      id\n      emojis\n      content\n      createdAt\n      subLength\n      ...VStreamChatSenderInfoFrag\n      __typename\n    }\n    ... on ChatSubStreak {\n      id\n      ...VStreamChatSenderInfoFrag\n      length\n      __typename\n    }\n    ... on ChatClip {\n      id\n      url\n      ...VStreamChatSenderInfoFrag\n      __typename\n    }\n    ... on ChatFollow {\n      id\n      ...VStreamChatSenderInfoFrag\n      __typename\n    }\n    ... on ChatDelete {\n      ids\n      __typename\n    }\n    ... on ChatBan {\n      id\n      ...VStreamChatSenderInfoFrag\n      bannedBy {\n        id\n        displayname\n        __typename\n      }\n      bannedByRoomRole\n      __typename\n    }\n    ... on ChatModerator {\n      id\n      ...VStreamChatSenderInfoFrag\n      add\n      __typename\n    }\n    ... on ChatEmoteAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      emote\n      __typename\n    }\n    ... on ChatTimeout {\n      id\n      ...VStreamChatSenderInfoFrag\n      minute\n      bannedBy {\n        id\n        displayname\n        __typename\n      }\n      bannedByRoomRole\n      __typename\n    }\n    ... on ChatTCValueAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      amount\n      totalAmount\n      __typename\n    }\n    ... on ChatGiftSub {\n      id\n      ...VStreamChatSenderInfoFrag\n      count\n      receiver\n      __typename\n    }\n    ... on ChatGiftSubReceive {\n      id\n      ...VStreamChatSenderInfoFrag\n      gifter\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment VStreamChatSenderInfoFrag on SenderInfo {\n  subscribing\n  role\n  roomRole\n  sender {\n    id\n    username\n    displayname\n    avatar\n    partnerStatus\n    badges\n    effect\n    __typename\n  }\n  __typename\n}\n",
    // variables: { streamer: "eksi" },
  },
  (event) => {
    console.log("Event received: ", event);
    // handle event
  },
  (error) => {
    console.log("Error: ", error);
    // handle error
  }
);
// {"id":"1","type":"start","payload":{,"extensions":{"persistedQuery":{"version":1,"sha256Hash":"7e70c2e0ec55dd3594c55b6907bef1dbc32a67eb9b608caf0552c2026994f8a2"}},"operationName":"StreamMessageSubscription",}}
