const Constants = require('../helpers/Constants');
const SelfUtils = require('../helpers/SelfUtils');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class FriendShip {
  constructor(data, proxyOptions = null, user_id, timeout, page_size) {
    this.headers = {
    ...Constants.HEADERS,
      'cookie': data['cookie'],
      'X-csrftoken': data['x_csrftoken'],
      'X-ig-app-id': data['x_ig_app_id'],
      'X-Instagram-Ajax': data['x_instagram_ajax']
    };
    this.proxyOptions = proxyOptions;
    this.followersList = [];
    this.followers_url = `https://www.instagram.com/api/v1/friendships/${user_id}/followers/`;
    this.followers_parameters = {
      count: `${page_size}`
   };

    this.followingList = [];
    this.following_url = `https://www.instagram.com/api/v1/friendships/${user_id}/following/`;
    this.following_parameters = {
        count: `${page_size}`
    };
    this.timeout = SelfUtils.secToMs(timeout);
  }

  async getFollowers() {
    const proxyCommand = SelfUtils.buildProxyCommand(this.proxyOptions); 
    const generatedHeader = SelfUtils.genMultiHeader(this.headers); 
    var queryString = SelfUtils.queryStringParameters(this.followers_parameters);
    const command = `curl -X GET ${generatedHeader} "${this.followers_url}?${queryString}" ${proxyCommand}`;
    try {
        const { stdout } = await exec(command);
        const response = JSON.parse(stdout);
        var nextMaxId = response.next_max_id;
        this.followersList.push(response);
        console.log("[*] followers are listing... " + this.followersList.length);

        if (!response.hasOwnProperty('next_max_id')) {
            return this.followersList;
        } else {
          this.followers_parameters.max_id = nextMaxId;
          await new Promise(resolve => setTimeout(resolve, this.timeout));
          return this.getFollowers();   
        }       

    } catch (error) {
      return { status: error}
    }
  }

  async getFollowing() {
    const proxyCommand = SelfUtils.buildProxyCommand(this.proxyOptions); 
    const generatedHeader = SelfUtils.genMultiHeader(this.headers); 
    var queryString = SelfUtils.queryStringParameters(this.following_parameters);
    const command = `curl -X GET ${generatedHeader} "${this.following_url}?${queryString}" ${proxyCommand}`;
    try {
        const { stdout } = await exec(command);
        const response = JSON.parse(stdout);
        var nextMaxId = response.next_max_id;
        this.followingList.push(response);
        console.log("[*] following are listing... " + this.followingList.length);

        if (!response.hasOwnProperty('next_max_id')) {
            return this.followingList;
        } else {
          this.following_parameters.max_id = nextMaxId;
          await new Promise(resolve => setTimeout(resolve, this.timeout));
          return this.getFollowing();   
        }       

    } catch (error) {
      return { status: error}
    }
  }
}

module.exports = FriendShip;
