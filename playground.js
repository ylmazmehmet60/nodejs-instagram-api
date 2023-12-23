const InstagramLogin = require('./InstagramLogin');
const WebProfileInfo = require('./Services/WebProfileInfo');
const UserFeed = require('./Services/UserFeed');

(async () => {
  var username = 'film.duragim';
  var password = 'Bb.1231233';

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