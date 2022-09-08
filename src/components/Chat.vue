<script setup lang="ts">
import { ServiceName } from "../services";
import { useChatStore } from "../stores/chat";
import randomColor from "randomcolor";
import { onBeforeUpdate, onUpdated } from "vue";

const chat = useChatStore();
const usernameColors = $ref(new Map<string, string>());
let scrollEnd = $ref(true);
const messageList = $ref<HTMLElement | null>(null);
let missedMessages = $ref(0);

const scrollToEnd = () => {
  if (!messageList) return;
  messageList.scrollTop = messageList.scrollHeight;
  scrollEnd = true;
  missedMessages = 0;
};

onUpdated(() => {
  if (!messageList) return;
  if (scrollEnd) scrollToEnd();
});

onBeforeUpdate(() => {
  if (!messageList) return;

  scrollEnd =
    messageList.scrollHeight - messageList.scrollTop ===
    messageList.clientHeight;

  if (scrollEnd) {
    missedMessages = 0;
  } else {
    missedMessages++;
  }
});

const usernameColor = (username: string, platform: ServiceName) => {
  if (!usernameColors.has(username)) {
    let color;
    switch (platform) {
      case "twitch":
        color = "purple";
        break;
      case "youtube":
        color = "red";
        break;
      case "dlive":
        color = "yellow";
        break;
    }
    usernameColors.set(
      username,
      randomColor({
        luminosity: "light",
        // hue: color,
      })
    );
  }
  return usernameColors.get(username);
};

const platformIcon: { [key in ServiceName]: string } = {
  twitch: "./platform-icons/twitch.svg",
  youtube: "./platform-icons/youtube.svg",
  dlive: "./platform-icons/dlive.png",
};
</script>

<template>
  <ul v-if="chat.messages.length" ref="messageList" class="message-list">
    <li v-for="msg in chat.messages" class="message">
      <img
        class="platform-icon"
        :src="platformIcon[msg.service]"
        :alt="msg.service"
      />
      <span :style="{ color: usernameColor(msg.author, msg.service) }">
        {{ msg.author }}:
      </span>
      <span>{{ msg.text }}</span>
    </li>
    <div v-if="!scrollEnd && missedMessages" class="scroll-notification">
      <button type="button" @click="scrollToEnd">
        You missed {{ missedMessages }} messages
      </button>
    </div>
  </ul>
  <div class="no-messages" v-else>
    <p>No messages yet.</p>
  </div>
</template>

<style scoped lang="scss">
.message-list {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  .message {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    .platform-icon {
      width: 1.2rem;
      height: 1.2rem;
      margin-right: 0.5rem;
      vertical-align: middle;
    }
  }
}

.no-messages {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
}

.scroll-notification {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  display: flex;
  justify-content: flex-end;
  button {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
}
</style>
