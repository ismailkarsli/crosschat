<script setup lang="ts">
import TitleBar from "./components/TitleBar.vue";
import Chat from "./components/Chat.vue";
import { useChatStore } from "./stores/chat";
import { onMounted } from "vue";

const chat = useChatStore();
onMounted(chat.init);
</script>

<template>
  <div class="main">
    <TitleBar />

    <Chat />
  </div>
</template>

<style scoped lang="scss">
.main {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
