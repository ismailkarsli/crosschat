<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window";
import { onMounted } from "vue";
import Settings from "./Settings.vue";

let show = $ref(false);
let alwaysOnTop = $ref(false);
let settings = $ref(false);

const minimize = () => appWindow.minimize();
const maximize = () => appWindow.toggleMaximize();
const close = () => appWindow.close();
const toggleAlwaysOnTop = () => {
  appWindow.setAlwaysOnTop(!alwaysOnTop);
  alwaysOnTop = !alwaysOnTop;
};
const toggleSettings = () => (settings = !settings);

onMounted(() => {
  // Activate always on top at start
  toggleAlwaysOnTop();

  document.body.addEventListener("mouseenter", () => (show = true));
  document.body.addEventListener("mouseleave", () => (show = false));
});
</script>

<template>
  <div class="titlebar" :class="{ show }">
    <div data-tauri-drag-region class="menu-items">
      <div @click="toggleSettings" class="titlebar-button" title="Settings">
        <img src="../assets/icons/cog.svg" alt="settings" />
      </div>
      <div
        @click="toggleAlwaysOnTop"
        class="titlebar-button"
        title="Always On Top"
        style="margin-left: auto"
      >
        <img
          v-if="alwaysOnTop"
          src="../assets/icons/baseline-gps-fixed.svg"
          alt="always on top"
        />
        <img
          v-else
          src="../assets/icons/baseline-gps-not-fixed.svg"
          alt="always on top"
        />
      </div>
      <div @click="minimize" class="titlebar-button" title="Minimize">
        <img src="../assets/icons/window-minimize.svg" alt="minimize" />
      </div>
      <div @click="maximize" class="titlebar-button" title="Minimize">
        <img src="../assets/icons/window-maximize.svg" alt="maximize" />
      </div>
      <div @click="close" class="titlebar-button" title="Close">
        <img src="../assets/icons/close.svg" alt="close" />
      </div>
    </div>

    <Settings v-if="settings" v-model:show="settings" />
  </div>
</template>

<style lang="scss" scoped>
.titlebar {
  height: 0px;
  transition: height 0.2s ease-in-out;
  overflow: hidden;
  background: rgb(48, 64, 92);
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  &.show {
    height: auto;
  }

  .menu-items {
    display: flex;
    justify-content: flex-end;

    .titlebar-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
