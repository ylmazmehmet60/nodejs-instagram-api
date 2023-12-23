const InstagramLogin = require('./InstagramLogin');
const WebProfileInfo = require('./Services/WebProfileInfo');
const UserFeed = require('./Services/UserFeed');

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

  // Fetch and display user feed data
  const userFeed = new UserFeed(loginData, null, "target-username");
  const userFeedData = await userFeed.getUserFeedData();

  // Initialize InstagramLogin over Proxy
  const instagramLoginWithProxy = new InstagramLogin(proxyOptions, username, password);
  await instagramLoginWithProxy.login();

})();