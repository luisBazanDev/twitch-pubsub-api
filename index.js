import { TwitchPubSubWS } from "./lib/WebSocket";
import { EventEmitter } from "events";

class TwitchPubSubApi extends EventEmitter {
  constructor({ oatuh, channels = [], topics = [] }) {
    super();
    this.tpws = new TwitchPubSubWS({ oatuh });

    this.tpws.ws.onmessage = (event) => {
      var message = JSON.parse(event.data);
      if (message.type == "RECONNECT") {
        console.log("Reconnecting...");
        setTimeout(self._connect, reconnectInterval);
        return;
      }

      console.log(1);

      if (message.type === "MESSAGE") {
        this.distributor(message.data);
      }
    };
    topics.forEach((topic) => {
      channels.forEach((channel) => {
        this.tpws._listen(topic, channel);
      });
    });
  }

  distributor(event) {}
}
