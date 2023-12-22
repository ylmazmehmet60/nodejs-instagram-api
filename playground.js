const InstagramLogin = require('./InstagramLogin');
const WebProfileInfo = require('./Services/ProfileInfo/webProfileInfo');
const UserFeed = require('./Services/ProfileInfo/userFeed');

(async () => {
  var username = 'username';
  var password = 'pass';

  const proxyOptions = {
    host: 'hostname',
    port: 80,
    username: 'proxyusr',
    password: 'proxypass'
  };

  const instagramLogin = new InstagramLogin(null, username, password);
  const loginData = await instagramLogin.login();
  console.log(loginData);

  const webProfileInfo = new WebProfileInfo(loginData, null, "seren.akbalik");
  const profileData = await webProfileInfo.getProfileData();
  console.log(profileData);

  const userFeed = new UserFeed(loginData, null, "seren.akbalik");
  const userFeedData = await userFeed.getUserFeedData();
  console.log(userFeedData);

})();