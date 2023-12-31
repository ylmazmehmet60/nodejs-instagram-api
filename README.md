﻿![image](https://github.com/ylmazmehmet60/nodejs-instagram-api/assets/35243461/d43428ad-e3c3-4e97-8f5c-36774ef8aa9c)

## Instagram Automation with Node.js

## Overview

This Node.js script provides automation for interacting with Instagram using the [NodeJS Instagram API](https://github.com/ylmazmehmet60/nodejs-instagram-api). It covers login, profile information retrieval, and fetching user feed data.

[Analysis the Instagram client-side password encryption by Reverse Enginering](https://www.linkedin.com/posts/ylmazmehmet60_analysis-the-instagram-client-side-password-activity-7136500148037206016-NjR0?utm_source=share&utm_medium=member_desktop)

## Features

1. **Login to Instagram**: With this script, you can automate the login process to Instagram by providing your credentials. The script utilizes the Instagram Private API to handle the authentication and login procedures programmatically.
2. **Profile Information**: The script allows you to retrieve comprehensive profile information for a specified Instagram user. This includes details such as the user's bio, profile picture, follower count, following count, and other relevant information.
3. **User Feed Data**: You can fetch and analyze the latest posts and activity from a targeted Instagram user's feed. This includes posts, captions, timestamps, and other relevant data to keep you updated on a user's recent Instagram activity.
3. **Followers and Following Lists**: You can fetch followers and follow list from a targeted Instagram user's. 

## Prerequisites

- Node.js installed on your machine v18.16.0
- Instagram account credentials (username and password)
- [NodeJS Instagram API](https://github.com/ylmazmehmet60/nodejs-instagram-api) library

## Setup

1. **Install npm package to your local machine.**

    ```bash
    npm i nodejs-instagram-api
    ```

## Usage

Customize the script according to your needs and execute it to automate various Instagram interactions.

- **Import dependency**
```javascript

const api = require('nodejs-instagram-api');

```

- **Initialize InstagramLogin**
```javascript

(async () => {

  var username = 'your-username';
  var password = 'your-password';

  const instagramLogin = new api.InstagramLogin(proxyOptions=null, username, password);
  const loginData = await instagramLogin.login();

})();

```
```bash

{
  cookie: 'csrftoken=XXXXX; rur="XXXXX"; mid=XXXXX; ds_user_id=XXXXX; sessionid=XXXXX',
  username: 'your-username',
  password: 'your-password',
  x_ig_app_id: 'XXXXX',
  x_csrftoken: 'XXXXX',
  ig_did: 'XXXXX',
  x_instagram_ajax: 'XXXXX'
}

```

- **Fetch and display profile information**
```javascript

(async () => {

  const webProfileInfo = new api.WebProfileInfo(loginData, proxyOptions=null, "target-username");
  const profileData = await webProfileInfo.getProfileData();

})();

```

- **Fetch and display user feed data**
```javascript
(async () => {

  const userFeed = new api.UserFeed(loginData, proxyOptions=null, "target-username");
  const userFeedData = await userFeed.getUserFeedData();

})();
```

- **Initialize InstagramLogin over Proxy**
```javascript

(async () => {

  const proxyOptions = {
    host: 'proxy-hostname',
    port: 80,
    username: 'proxy-username',
    password: 'proxy-password'
  };

  var username = 'your-username';
  var password = 'your-password';

  const instagramLogin = new api.InstagramLogin(proxyOptions, username, password);
  const loginData = await instagramLogin.login();

})();

```

- **Followers and Following Lists**
1. The FriendShip class is configured with relevant parameters, including a timeout of 5 seconds (secTimeout) and a page size of 200 (pageSize).
2. Asynchronous calls are made to retrieve the followers and following lists of the target user using the getFollowers and getFollowing methods, respectively.
3. [Sample output](https://gist.github.com/ylmazmehmet60/54159a7cc822992a9d4f2b4f1d0e89a1)

```javascript

(async () => {

  // Extract the target user's ID from the profile data
  // Create a new instance of the FriendShip class with relevant parameters
  const webProfileInfo = new api.WebProfileInfo(loginData, proxyOptions=null, "target-username");
  const profileData = await webProfileInfo.getProfileData();
  const targetUser = profileData.data.user.id;
  const friendShip = new api.FriendShip(loginData, null, targetUser, secTimeout=5, pageSize=200);
  // Use asynchronous calls to get the followers and following lists
  var followers = await friendShip.getFollowers();
  var following = await friendShip.getFollowing();
  
})();

```