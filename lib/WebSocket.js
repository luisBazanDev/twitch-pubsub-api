import WebSocket from "ws";
import assert from "assert";

export class TwitchPubSubWS extends WebSocket {
  constructor({ oauth, url }) {
    super(url);
    this.oauth = oauth;
    try {
      assert(this.oauth);
    } catch (e) {
      throw new Error("Invalid OAuth");
    }

    // For TwitchApi
    this.heartBeatInterval = 1000 * 60;
    this.reconnectInterval = 1000 * 3;
    this.heartBeatHandle;
  }

  onopen() {
    heartBeat();

    console.log("open");
    this.heartBeatHandle = setInterval(this.heartBeat, this.heartBeatInterval);
  }

  onerror(err) {
    throw new Error(err);
  }

  nonce(length) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async register(topic, channel) {
    var message = {
      type: "LISTEN",
      nonce: this.nonce(15),
      data: {
        topics: [`${topic}.${channel}`],
        auth_token: this.oauth,
      },
    };

    if (this.readyState === WebSocket.OPEN) this.send(JSON.stringify(message));
  }

  heartBeat() {
    var message = {
      type: "PING",
      data: {
        auth_token: this.oauth,
      },
    };

    if (this.readyState === WebSocket.OPEN) this.send(JSON.stringify(message));
  }
}
