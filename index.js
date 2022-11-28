import { TwitchPubSubWS } from "./lib/WebSocket.js";
import { EventEmitter } from "events";

class TwitchPubSubApi extends EventEmitter {
  constructor({ oauth, channels = [46024993] }) {
    super();
    this.oauth = oauth;
    this.tpws = new TwitchPubSubWS({
      oauth: this.oauth,
      url: "wss://pubsub-edge.twitch.tv",
    });

    this.once("newListener", (event, listener) => {
      switch (event) {
        case "channel-bits":
          event = "channel-bits-events-v2";
          break;

        case "channel-points":
          event = "channel-points-channel-v1";
          break;

        case "channel-subscriptions":
          event = "channel-subscribe-events-v1";
          break;

        case "channel-bits-badge":
          event = "channel-bits-badge-unlocks";
          break;

        case "chat-moderatoractions":
          event = "chat_moderator_actions";
          break;

        case "whispers":
          event = "whispers";
          break;
        default:
          return;
      }
      channels.forEach((channel) => {
        this.tpws.register(event, channel);
      });
    });

    this.tpws.onmessage = this.message;
  }

  message(msg) {
    console.log(JSON.parse(msg));
  }
}

export default TwitchPubSubApi;
