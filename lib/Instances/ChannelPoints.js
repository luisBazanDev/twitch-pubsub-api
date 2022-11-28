import User from "./User";
export default class ChannelPoints {
  constructor(data) {
    this.raw = data;
    this.timestamp = data.timestamp;
    this.redemption = data.redemption;
    this._id = data.redemption.id;
    this.channelId = data.redemption.channel_id;
    this.status = data.redemption.status;
    this.userInput = data.redemption.user_input;
    this.hasUserInput = data.redemption.user_input ? true : false;
    this.user = new User(data.redemption.user);

    // reward data
    this.id = data.redemption.reward.id;
    this.title = data.redemption.reward.title;
    this.prompt = data.redemption.reward.prompt;
    this.cost = data.redemption.reward.cost;
    this.requireInput = data.redemption.reward.is_user_input_required;
    this.requireSub = data.redemption.reward.is_sub_only;
    this.images = data.redemption.reward.image;
    this.default_image = data.redemption.reward.default_image;
    this.color = data.redemption.reward.background_color;
    this.enabled = data.redemption.reward.is_enabled;
    this.pause = data.redemption.reward.is_paused;
    this.stock = data.redemption.reward.is_in_stock;
    this.hasLimit = data.redemption.reward.max_per_stream.is_enabled;
    this.limitPerStream = data.redemption.reward.max_per_stream.max_per_stream;
    this.autoComplete =
      data.redemption.reward.should_redemptions_skip_request_queue;
  }

  getImage({ scale = 56 }) {
    switch (scale) {
      case 28:
        return this.images.url_1x;
      case 56:
        return this.images.url_2x;
      case 112:
        return this.images.url_4x;
      default:
        return this.images.url_2x;
    }
  }

  getDefaultImage({ scale = 56 }) {
    switch (scale) {
      case 28:
        return this.default_image.url_1x;
      case 56:
        return this.default_image.url_2x;
      case 112:
        return this.default_image.url_4x;
      default:
        return this.default_image.url_2x;
    }
  }
}
