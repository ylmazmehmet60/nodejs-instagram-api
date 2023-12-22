const Constants = require('../../helpers/Constants');
const SelfUtils = require('../../helpers/SelfUtils');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class UserFeed {
  constructor(data, proxyOptions = null, targetUsername) {
    this.username = targetUsername;
    this.headers = {
    ...Constants.HEADERS,
      'cookie': data['cookie'],
      'X-csrftoken': data['x_csrftoken'],
      'X-ig-app-id': data['x_ig_app_id'],
      'X-Instagram-Ajax': data['x_instagram_ajax']
    };
    this.url = `https://www.instagram.com/api/v1/feed/user/${this.username}/username/?count=12`;
    this.proxyOptions = proxyOptions;
  }

  async getUserFeedData() {
    const proxyCommand = SelfUtils.buildProxyCommand(this.proxyOptions); 
    const generatedHeader = SelfUtils.genMultiHeader(this.headers); 
    const command = `curl -X GET ${generatedHeader} ${this.url}${this.username} ${proxyCommand}`;
    try {
      const { stdout } = await exec(command);
      const response = JSON.parse(stdout);
      return response;
    } catch (error) {
      return { status: 'error'}
    }
  }
}

module.exports = UserFeed;

