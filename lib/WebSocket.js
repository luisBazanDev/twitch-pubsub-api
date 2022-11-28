import WebSocket from "websocket";
import assert from "assert";

export class TwitchPubSubWS {
  constructor(oauth) {
    try {
      assert(oauth);
    } catch (e) {
      throw new Error("Invalid OAuth");
    }

    this.oauth = oauth;
    this.ws = new WebSocket("wss://pubsub-edge.twitch.tv");
    this.heartBeatInterval = 1000 * 60;
    this.reconnectInterval = 1000 * 3;
    this.heartBeatHandle;

    this.ws.onopen = () => {
      heartBeat();

      this.heartBeatHandle = setInterval(
        this.heartBeat,
        this.heartBeatInterval
      );
    };
    this.ws.onerror = (err) => {
      throw new Error(err);
    };
  }

  async _listen(topic, channel) {
    const nonce = (length) => {
      var text = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    if (topic) {
      switch (topic) {
        case "channel-bits":
          topic = "channel-bits-events-v1";
          break;

        case "channel-points":
          topic = "channel-points-channel-v1";
          break;

        case "channel-subscriptions":
          topic = "channel-subscribe-events-v1";
          break;

        case "channel-bits-badge":
          topic = "channel-bits-badge-unlocks";
          break;

        case "chat-moderatoractions":
          topic = "chat_moderator_actions";
          break;

        case "whispers":
          topic = "whispers";
          break;
      }
    }

    var message = {
      type: "LISTEN",
      nonce: nonce(18),
      data: {
        topics: [`${topic}.${channel}`],
        auth_token: this.oauth,
      },
    };

    if (this.ws.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify(message));
  }

  heartBeat() {
    var message = {
      type: "PING",
      data: {
        auth_token: this.oauth,
      },
    };

    if (this.ws.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify(message));
  }
}
