import { createApp } from "vue";
import App from "./App.vue";

export const mountTrekkiStore = () => {
  const root = document.getElementById("app");
  if (!root) return;
  createApp(App, {
    pageId: root.dataset.page
  }).mount(root);
};
