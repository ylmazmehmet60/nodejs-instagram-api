﻿![image](https://github.com/ylmazmehmet60/nodejs-instagram-api/assets/35243461/d43428ad-e3c3-4e97-8f5c-36774ef8aa9c)

## Instagram Automation with Node.js

## Overview

This Node.js script provides automation for interacting with Instagram using the [NodeJS Instagram API](https://github.com/ylmazmehmet60/nodejs-instagram-api). It covers login, profile information retrieval, and fetching user feed data.

## Features

1. **Login to Instagram**: With this script, you can automate the login process to Instagram by providing your credentials. The script utilizes the Instagram Private API to handle the authentication and login procedures programmatically.
2. **Profile Information**: The script allows you to retrieve comprehensive profile information for a specified Instagram user. This includes details such as the user's bio, profile picture, follower count, following count, and other relevant information.
3. **User Feed Data**: You can fetch and analyze the latest posts and activity from a targeted Instagram user's feed. This includes posts, captions, timestamps, and other relevant data to keep you updated on a user's recent Instagram activity.

## Prerequisites

- Node.js installed on your machine
- Instagram account credentials (username and password)
- [NodeJS Instagram API](https://github.com/ylmazmehmet60/nodejs-instagram-api) library

## Setup

1. **Install npm package to your local machine.**

    ```bash
    npm i nodejs-instagram-api
    ```

## Usage

Customize the script according to your needs and execute it to automate various Instagram interactions.

1. it need to initialize InstagramLogin to loginData
2. if needed proxyOptions add instead of null 

- **Import dependency**
```javascript
const api = require('nodejs-instagram-api');
```

- **Initialize InstagramLogin**
```javascript
(async () => {
  var username = 'your-username';
  var password = 'your-password';

  const instagramLogin = new api.InstagramLogin(null, username, password);
  const loginData = await instagramLogin.login();
})();
```
```bash
{
  cookie: 'csrftoken=example; rur="example"; mid=example; ds_user_id=example; sessionid=example',
  username: 'your-username',
  password: 'your-password',
  x_ig_app_id: 'example',
  x_csrftoken: 'example',
  ig_did: 'example',
  x_instagram_ajax: 'example'
}
```

- **Fetch and display profile information**
```javascript
(async () => {
  const webProfileInfo = new api.WebProfileInfo(loginData, null, "target-username");
  const profileData = await webProfileInfo.getProfileData();
})();
```
```bash
{
  data: {
    user: {
      ai_agent_type: null,
      biography: '',
      bio_links: [],
      fb_profile_biolink: null,
      ...
    }
  }
}  
```

- **Fetch and display user feed data**
```javascript
(async () => {
  const userFeed = new api.UserFeed(loginData, null, "target-username");
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

