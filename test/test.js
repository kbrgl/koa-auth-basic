'use strict';

const request = require('supertest');
const assert = require('assert');
const authBasic = require('..');
const Koa = require('koa');

describe('Koa Auth Basic', () => {
  describe('setup', () => {
    it('should throw an error when called without checkCredentials', () => {
      assert.throws(() => {
        authBasic()
      });
    })
  })

  describe('with no credentials', () => {
    it('should `throw` 401', done => {
      const app = new Koa()

      app.use(authBasic({
        checkCredentials: function (name, pass) {
          return name === 'name' && pass === 'pass'
        },
      }))

      request(app.listen())
      .get('/')
      .expect(401)
      .end(done)
    })
  })

  describe('with invalid credentials', () => {
    it('should `throw` 401', done => {
      const app = new Koa()

      app.use(authBasic({
        checkCredentials: function (name, pass) {
          return name === 'name' && pass === 'pass'
        },
      }))

      request(app.listen())
      .get('/')
      .auth('malicious', 'attempt')
      .expect(401)
      .end(done)
    })
  })

  describe('with valid credentials', () => {
    it('should call the next middleware', done => {
      const app = new Koa()

      app.use(authBasic({
        checkCredentials: function (name, pass) {
          return name === 'name' && pass === 'pass'
        },
      }))
      app.use(ctx => {
        ctx.body = 'Protected'
      })

      request(app.listen())
      .get('/')
      .auth('name', 'pass')
      .expect(200)
      .expect('Protected')
      .end(done)
    })
  })
})