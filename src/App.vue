<script setup lang="ts">
import { onMounted } from "vue";
import { useChatStore } from "./stores/chat";

const chat = useChatStore();

onMounted(async () => {
  chat.twitch.channelName = "geryan";
  chat.connectTwitch();
  chat.youtube.channelId = "UC9YUii4XC_prj5jqb4u5TUg";
  chat.connectYoutube();
});
</script>

<template>
  <div class="container">
    <h1>Welcome to Tauri!</h1>

    <ul>
      <li v-for="msg in chat.messages">
        <span>{{ msg.author }} ({{ msg.service }}): </span>
        <span>{{ msg.text }}</span>
      </li>
    </ul>
  </div>
</template>
