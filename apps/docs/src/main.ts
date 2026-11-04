import { createApp } from "vue";
import App from "./App.vue";
// 部品の構造の CSS（ライブラリのソースを直接読むので、ここで明示して読む）
import "../../../packages/ui/src/styles/index.css";
import "@s_and_a/arrow-ui-design-remix/styles.css";
import "@s_and_a/arrow-ui-design-classic/styles.css";
import "./docs.css";

createApp(App).mount("#app");
