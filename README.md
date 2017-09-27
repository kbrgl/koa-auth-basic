# koa-auth-basic

  Basic auth with custom credential check.

## Installation

```js
$ npm install koa-auth-basic
```

## Example

  Protect downstream middleware:

```js
const auth = require('koa-auth-basic')
const Koa = require('koa')
const app = new Koa()

// custom 401 handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (401 == err.status) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.body = 'cant haz that'
    } else {
      throw err
    }
  }
})

// require auth
app.use(auth({
  checkCredentials: function (name, pass) {
    return /^[kK]a(bir|ran)$/.test(name) && pass === 'secret'
  }
}))

// secret response
app.use(async (ctx) => {
  ctx.body = 'secret'
});

app.listen(3000, function () {
  console.log('listening on port 3000')
})
```

  Example request:

```
$ curl -H "Authorization: basic dGo6dG9iaQ==" http://localhost:3000/ -i
HTTP/1.1 200 OK
X-Powered-By: koa
Content-Type: text/plain; charset=utf-8
Content-Length: 6
Date: Sat, 30 Nov 2013 19:35:17 GMT
Connection: keep-alive

secret
```

 Using the [mount](https://github.com/koajs/mount) middleware you may specify auth for a given prefix:

```js
const mount = require('koa-mount')
const auth = require('koa-auth-basic')

app.use(mount('/admin', auth({
  checkCredentials: function (name, pass) {
   return name === 'kbrgl' && pass === 'secret'
  }
})))
```

## License

  MIT

## Credits
koa-auth-basic is inspired by [koa-basic-auth](https://github.com/koajs/basic-auth)