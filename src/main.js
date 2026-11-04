import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import DataVVue3 from "@kjgl77/datav-vue3";

let app = createApp(App);
app.use(DataVVue3).mount("#app");
