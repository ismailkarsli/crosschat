<script lang="ts" setup>
import { onMounted } from "vue";
import { useChatStore } from "../stores/chat";

defineProps({
  show: {
    type: Boolean,
  },
});
const emit = defineEmits(["update:show"]);

const chat = useChatStore();

let loading = $ref(false);
let twitchUser = $ref<string | undefined>();
let youtubeChannelId = $ref<string | undefined>();
let dliveUser = $ref<string | undefined>();

const save = async () => {
  loading = true;
  await Promise.allSettled([
    chat.loadTwitch(twitchUser),
    chat.loadYoutube(youtubeChannelId),
    chat.loadDlive(dliveUser),
  ]);

  loading = false;
  emit("update:show", false);
};

onMounted(async () => {
  twitchUser = chat.twitchUsername;
  youtubeChannelId = chat.youtubeChannelId;
  dliveUser = chat.dliveUsername;
});
</script>

<template>
  <div class="relative">
    <form id="settings" @submit.prevent="save">
      <div>
        <label for="twitch-user">Twitch Username</label>
        <input type="text" id="twitch-user" v-model="twitchUser" />
      </div>

      <div>
        <label for="youtube-channel-id">Youtube Channel ID</label>
        <input type="text" id="youtube-channel-id" v-model="youtubeChannelId" />
      </div>

      <div>
        <label for="dlive-user">DLive Username</label>
        <input type="text" id="dlive-user" v-model="dliveUser" />
      </div>

      <button type="submit">Save</button>
    </form>
    <!-- prettier-ignore -->
    <div v-if="loading" class="loading">
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#settings {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;

  > div {
    margin-bottom: 0.5rem;
    width: 100%;
  }

  label {
    display: block;
    font-size: 0.8rem;
  }

  button {
    display: block;
    border-radius: 0;
    border: 0;
    padding: 0.5rem;
    background: white;
    border-radius: 2px;
    cursor: pointer;
  }

  input[type="text"] {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    color: white;
    border-radius: 2px;
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem 0;
  }
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
