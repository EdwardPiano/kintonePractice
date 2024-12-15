import { createApp } from "vue";
import ButtonComponent from "./ButtonComponent.vue"; // Vue 組件

(function () {
  "use strict";

  kintone.events.on("app.record.index.show", (event) => {
    if (document.getElementById("custom-menu-button")) {
      return event;
    }

    const menuSpace = kintone.app.getHeaderMenuSpaceElement();
    if (menuSpace) {
      const buttonContainer = document.createElement("div");
      buttonContainer.id = "custom-menu-button";
      menuSpace.appendChild(buttonContainer);

      const app = createApp(ButtonComponent);
      app.mount("#custom-menu-button");
    }

    return event;
  });
})();
