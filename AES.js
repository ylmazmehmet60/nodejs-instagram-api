const crypto = require("crypto");

function formatPassword(a, b, c) {
  return `#PWD_INSTAGRAM_BROWSER:${c}:${b}:${a}`;
}

const g = 64;
const h = 1;
const i = 1;
const j = 1;
const k = require("tweetnacl-sealedbox-js").overheadLength;
const l = 2;
const m = 32;
const n = 16;
const o = i + j + l + m + k + n;

function p(a, c) {
  return require("tweetnacl-sealedbox-js").seal(a, c);
}

function q(a) {
  const b = [];
  for (let c = 0; c < a.length; c += 2) {
    b.push(parseInt(a.slice(c, c + 2), 16));
  }
  return new Uint8Array(b);
}

const PolarisEnvelopeEncryption = {
  encrypt: function (a, c, d, e) {
    return new Promise((resolve, reject) => {
      const f = o + d.length;
      if (c.length !== g) {
        throw new Error("public key is not a valid hex sting");
      }
      const r = q(c);
      if (!r) {
        throw new Error("public key is not a valid hex string");
      }
      const s = Buffer.alloc(f);
      let t = 0;
      s[t] = h;
      t += i;
      s[t] = a;
      t += j;

      const keyAlgorithm = {
        name: "AES-GCM",
        length: m * 8,
      };
      const encryptionAlgorithm = {
        name: "AES-GCM",
        iv: Buffer.alloc(12),
        additionalData: e,
        tagLen: 16,
      };

      crypto.subtle
        .generateKey(keyAlgorithm, true, ["encrypt", "decrypt"])
        .then((key) => {
          c = crypto.subtle.exportKey("raw", key);
          a = crypto.subtle.encrypt(encryptionAlgorithm, key, d);
          return Promise.all([c, a]);
        })
        .then((a) => {
          var b = new Uint8Array(a[0]);
          b = p(b, r);
          s[t] = b.length & 255;
          s[t + 1] = (b.length >> 8) & 255;
          t += l;
          s.set(b, t);
          t += m;
          t += k;
          if (b.length !== m + k)
            throw new Error("encrypted key is the wrong length");
          b = new Uint8Array(a[1]);
          a = b.slice(-n);
          b = b.slice(0, -n);
          s.set(a, t);
          t += n;
          s.set(b, t);
          resolve(s);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

function encPassword(version, public_key, pwd, timestamp, format_version) {
  return new Promise((resolve, reject) => {
    PolarisEnvelopeEncryption.encrypt(
      version,
      public_key,
      Buffer.from(pwd),
      Buffer.from(timestamp),
    )
      .then((encryptedData) => {
        const base64EncryptedData = encryptedData.toString("base64");
        const formattedPassword = formatPassword(
          base64EncryptedData.toString(),
          timestamp,
          format_version,
        );
        resolve(formattedPassword);
      })
      .catch((error) => {
        reject(error); // Reject with error
      });
  });
}

module.exports = {
  encPassword: encPassword,
};
