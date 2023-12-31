
class SelfUtils {

    static buildProxyCommand(proxyOptions) {
        if (proxyOptions) {
            const { username, password, host, port } = proxyOptions;
            return `--proxy http://${username}:${password}@${host}:${port}`;
        }
        return '';
    }

    static genMultiHeader(headers) {
        return Object.entries(headers).map(([key, value]) => `-H "${key}: ${value}"`).join(' ');
    }

    static cookieHandler(cookieStrings) {
        let csrfToken = '';
        const cookiesArray = cookieStrings.split('\n');
        const targetKeys = ['sessionid', 'csrftoken', 'rur', 'mid', 'ds_user_id', 'sessionid', 'ig_did'];
        const json = cookiesArray.reduce((result, cookie) => {
            const match = cookie.match(/^Set-Cookie: (\w+)=([^;]+)/);
          if (match && targetKeys.includes(match[1])) {
            if (match[1] == targetKeys[1]) {
                csrfToken = decodeURIComponent(match[2]);
            }
            result[match[1]] = decodeURIComponent(match[2]);
          }
          return result;
        }, {});
        const joined = Object.entries(json).map(([key, value]) => `${key}=${value}`).join('; ');
        return {joined, csrfToken};
    }

    static queryStringParameters(parameters) {
        var result = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
        .join('&');
        return `${result}`
    }

    static secToMs(seconds) {
        return seconds * 1000;
    }
}

module.exports = SelfUtils;