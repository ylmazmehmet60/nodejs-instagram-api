const InstagramLogin = require('./InstagramLogin');
const WebProfileInfo = require('./Services/WebProfileInfo');
const UserFeed = require('./Services/UserFeed');
const FriendShip =  require('./Services/FriendShip') ;

(async () => {
  // Set Instagram credentials
  var username = 'your-username';
  var password = 'your-password';

  // Set proxy options if needed
  const proxyOptions = {
    host: 'proxy-hostname',
    port: 80,
    username: 'proxy-username',
    password: 'proxy-password'
  };

  // Initialize InstagramLogin
  const instagramLogin = new InstagramLogin(null, username, password);
  const loginData = await instagramLogin.login();

  // Fetch and display profile information
  const webProfileInfo = new WebProfileInfo(loginData, null, "target-username");
  const profileData = await webProfileInfo.getProfileData();

  // Extract the target user's ID from the profile data
  // Create a new instance of the FriendShip class with relevant parameters
  var targetUser = profileData.data.user.id;
  const friendShip = new FriendShip(loginData, null, targetUser, secTimeout=5, pageSize=200);
  // Use asynchronous calls to get the followers and following lists
  var followers = await friendShip.getFollowers();
  var following = await friendShip.getFollowing();

  // Fetch and display user feed data
  const userFeed = new UserFeed(loginData, null, "target-username");
  const userFeedData = await userFeed.getUserFeedData();

  // Initialize InstagramLogin over Proxy
  const instagramLoginWithProxy = new InstagramLogin(proxyOptions, username, password);
  await instagramLoginWithProxy.login();

})();