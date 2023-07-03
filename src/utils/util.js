import JSEncrypt from 'jsencrypt';

// 定义公钥
const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCochIaKWEh6IIK1pJQcJPsYhZ2AJmGNc12XeC2lsj3dHkMO9vGrXN4ZJiN3qNLlO3hERtY0UZdN8Uz18zoiL60XoOclMuuwf1TwiMA3/4Vy2NOaQdX/RgLQ8XiRobVPLMe/JTteZ6eoPrWVC5jf4kdWD7LWwgdWrnzGs/4UiWnsQIDAQAB`;

//深度克隆
export function deepCopy(o) {
  if (o instanceof Array) {
    let n = [];
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else if (o instanceof Object) {
    let n = {};
    for (let i in o) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}

/**
 * rsa加密
 * @author: nxy
 * @Date: 2022-10-16 21:53:44
 */
export function RsaEncry(data) {
  // 使用 RSA 公钥加密 请求响应解密的key
  const myEncrypt = new JSEncrypt();
  myEncrypt.setPublicKey(publicKey);
  const cryptRespKeyStr = myEncrypt.encrypt(data);
  return cryptRespKeyStr;
}
