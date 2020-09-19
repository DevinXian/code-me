### JWT (json web token)

1. 问题：cookie 不安全，且有跨域问题；session 服务器端内存压力大，需要考虑 skicky-session 及分布式架构扩展支持
2. 流程：客户端通过用户名+密码换 jwt，下次请求头（`Authorization: Bearer <token>`）携带 jwt，服务器中间件解出 jwt 信息，实现鉴权（放在 url 或者 body 也可，不推荐）
3. 具体实现：

    - 结构：`.`分割的三部分：Header、Payload、Signature，前两者用 base64URL 编码
    - 头部字段: `{ "alg": "HS256", "typ": "JWT" }`
    
    - 载体官方字段如下，可添加自定义字段: 

      - iss (issuer)：签发人
      - exp (expiration time)：过期时间
      - sub (subject)：主题
      - aud (audience)：受众
      - nbf (Not Before)：生效时间
      - iat (Issued At)：签发时间
      - jti (JWT ID)：编号

    - 签名部分存加密，算法： HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
    - 其中 secret 服务器端保存，故而可以防篡改


3. 优点：可水平扩展，减轻服务器压力，有效解决 sticky-session 问题
4. 缺点：jwt 有效时间内，服务端由于不保存状态，无法主动过期；无法避免有效期内的重放攻击
5. 注意点：默认不加密；不加密不要放入秘密信息；采用 https 降低盗用风险
6. Base64URL: Base64 基础上 =被省略、+替换成-，/替换成_，满足 URL 传输要求

*额外链接：Base64 算法: https://en.wikipedia.org/wiki/Base64*
