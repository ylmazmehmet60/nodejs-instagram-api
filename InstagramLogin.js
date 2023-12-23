const InstagramEncryptor = require('./AES');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const SelfUtils = require('./helpers/SelfUtils');
const Constants = require('./helpers/Constants');

class InstagramLogin {
  constructor(proxyOptions = null, username, password) {
    this.headers = Constants.HEADERS;
    this.instagram = Constants.URLS.INSTAGRAM;
    this.sharedData = Constants.URLS.INSTAGRAM_SHARED_DATA;
    this.loginAjax = Constants.URLS.WEB_LOGIN_AJAX;
    this.formatVersion = Constants.FORMAT_VERSION;
    this.proxyOptions = proxyOptions;
    this.username = username;
    this.password = password;
  }


  async getHtml() {
    try {
      const data = await this.curlRequest(this.instagram);
      const xInstagramAjax = data.substring(data.indexOf('"server_revision":') + '"server_revision":'.length, data.indexOf(',"client_revision"'));
      const appId = data.substring(data.indexOf('"APP_ID":"') + '"APP_ID":"'.length, data.indexOf('","IS_BUSINESS_DOMAIN"'));
      return { xInstagramAjax: xInstagramAjax, appId: appId };
    } catch (error) {
      console.log(`Command execution failed: ${error.message}`);
    }
  }


  async curlRequest(url) {
    const proxyCommand = SelfUtils.buildProxyCommand(this.proxyOptions);
    const command = `curl -vvv ${url} ${proxyCommand}`;
    try {
      const { stdout } = await exec(command);
      return stdout;
    } catch (error) {
      console.log(`Command execution failed: ${error.message}`);
    }
  }

  async curlPostRequest(url, postData, headers) {
    const proxyCommand = SelfUtils.buildProxyCommand(this.proxyOptions); 
    const generatedHeader = SelfUtils.genMultiHeader(headers); 
    const command = `curl -X POST -d "${postData}" ${generatedHeader} -i ${url} ${proxyCommand} 2>&1 | findstr "Set-Cookie"`;
    try {
      const { stdout } = await exec(command);
      return stdout;
    } catch (error) {
      console.log(`Command execution failed: ${error.message}`);
    }
  }

  async login() {
    try {
      const response = await this.curlRequest(this.sharedData);
      const data =  JSON.parse(response);
      const encryption = data.encryption;
      const keyId = encryption.key_id;
      const publicKey = encryption.public_key;
      const deviceId = data.device_id;
      const csrfToken = data.config.csrf_token;
      const timestamp = String(Math.floor(Date.now() / 1000));
  
      const { xInstagramAjax, appId } = await this.getHtml();
      this.headers['x-instagram-ajax'] = xInstagramAjax;
      this.headers['x-ig-app-id'] = appId;
      this.headers['x-csrftoken'] = csrfToken;
      this.headers['cookie'] = `csrf_token=${csrfToken}; ig_did=${deviceId};`;

      const formattedPassword = await InstagramEncryptor.encPassword(keyId, publicKey, this.password, timestamp, this.formatVersion);
      const postData = `enc_password=${encodeURIComponent(formattedPassword)}&optIntoOneTap=false&queryParams=%7B%7D&trustedDeviceRecords=%7B%7D&username=${this.username}`;
      
      const receivedCookies = await this.curlPostRequest(this.loginAjax, postData, this.headers);
      let cookies = SelfUtils.cookieHandler(receivedCookies)  
      const authParams = {};
      if (cookies.joined.includes("ds_user_id") && cookies.joined != undefined) {
        console.log("[*] user cookie data is obtained.");
        authParams['cookie'] = cookies.joined;
        authParams['username'] = this.username;
        authParams['password'] = this.password;  
        authParams['x_ig_app_id'] = appId;  
        authParams['x_csrftoken'] = cookies.csrfToken;
        authParams['ig_did'] = deviceId;
        authParams['x_instagram_ajax'] = xInstagramAjax;
        return authParams;
      }
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

module.exports = InstagramLogin;
