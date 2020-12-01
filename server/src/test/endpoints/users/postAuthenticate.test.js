require('dotenv').config({ path: '.env.test' });
const assert = require('assert');
const utils = require('../../utils');
const app = require('../../../app').App;
const request = require('supertest');
const log = require('../../../utils/logger')(module);
const constants = require('./../../../constants/constants');
const User = require('./../../../models/userModel').User;
const security = require('../../../utils/security');
const user1fixture = require('../../fixtures/users').USER_1;

describe(constants.USERS_BASE_URL, function (done) {

    beforeEach(async function () {
        await utils.prepareDatabaseBeforeTest();
    });

    describe('POST ' + constants.USERS_BASE_URL + "/:username/authenticate", function () {
        it('get 404 on authenticate', function (done) {
            request(app)
                .post(constants.USERS_BASE_URL+"/not_existing_username/authenticate")
                .send({username: "not_existing_username", password: "password"})
                .expect('Content-Type', /json/)
                .expect(constants.RESPONSE_CODE.NOT_FOUND)
                .end(function (err, res) {
                    assert.equal(err, null, err);
                    const resp = JSON.parse(res.text);
                    assert.strictEqual(resp.code, constants.RESPONSE_CODE.NOT_FOUND, JSON.stringify(res));
                    assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.NOT_FOUND, JSON.stringify(res));
                    done();
                });
        });
        it('get 422 on authenticate empty body request', function (done) {
            request(app)
                .post(constants.USERS_BASE_URL + "/"+user1fixture.username+"/authenticate")
                .expect('Content-Type', /json/)
                .expect(constants.RESPONSE_CODE.UNPROCESSABLE_ENTITY)
                .end(function (err, res) {
                    assert.equal(err, null, err);
                    const resp = JSON.parse(res.text);
                    assert.strictEqual(resp.code, constants.RESPONSE_CODE.UNPROCESSABLE_ENTITY);
                    assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.UNPROCESSABLE_ENTITY);
                    assert.strictEqual(res.text.includes('username is required'), true);
                    assert.strictEqual(res.text.includes('password is required'), true);
                    done();
                });
        });
        it('get 200 on authenticate', function (done) {
            request(app)
                .post(constants.USERS_BASE_URL+"/"+user1fixture.username+"/authenticate")
                .send({username: user1fixture.username, password: user1fixture.password})
                .expect('Content-Type', /json/)
                .expect(constants.RESPONSE_CODE.OK)
                .end(function (err, res) {
                    const resp = JSON.parse(res.text);
                    log.info(resp);
                    assert.strictEqual(resp.code, constants.RESPONSE_CODE.OK);
                    assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.OK);

                    let tokens = resp.data;
                    log.info(tokens);
                    assert.strictEqual(!!tokens.accessToken, true);
                    assert.strictEqual(!!tokens.refreshToken, true);
                    done();
                });
        });
    });

    describe('POST ' + constants.USERS_BASE_URL, function () {
        // it('get 422 on empty body request', function (done) {
        //     request(app)
        //         .post(constants.USERS_BASE_URL)
        //         .expect('Content-Type', /json/)
        //         .expect(constants.RESPONSE_CODE.UNPROCESSABLE_ENTITY)
        //         .end(function (err, res) {
        //             const resp = JSON.parse(res.text);
        //             //log.info(res.text);
        //             assert.strictEqual(resp.code, constants.RESPONSE_CODE.UNPROCESSABLE_ENTITY);
        //             assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.UNPROCESSABLE_ENTITY);
        //             assert.strictEqual(res.text.includes('username is required'), true);
        //             assert.strictEqual(res.text.includes('password is required'), true);
        //             assert.strictEqual(res.text.includes('salt'), false);
        //             assert.strictEqual(res.text.includes('hashedPassword'), false);
        //             done();
        //         });
        // });
        // it('get 201 on valid request body', function (done) {
        //     request(app)
        //         .post(constants.USERS_BASE_URL)
        //         .set('Accept', 'application/json')
        //         .set('Content-Type', 'application/json')
        //         .send({username: "username", password: "password"})
        //         .expect('Content-Type', /json/)
        //         .expect(constants.RESPONSE_CODE.CREATED)
        //         .end(function (err, res) {
        //             const resp = JSON.parse(res.text);
        //             //log.info(resp);
        //             assert.strictEqual(resp.code, constants.RESPONSE_CODE.CREATED);
        //             assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.CREATED);
        //             assert.strictEqual(res.text.includes('username is required'), false);
        //             assert.strictEqual(res.text.includes('password is required'), false);
        //             assert.strictEqual(res.text.includes('salt'), false);
        //             assert.strictEqual(res.text.includes('hashedPassword'), false);
        //
        //             User.findOne({username: 'username'}, function (err, doc) {
        //                 assert.strictEqual(!err, true);
        //                 log.info(doc);
        //                 assert.strictEqual(doc.username, 'username');
        //                 assert.strictEqual(security.checkPassword('password', doc.salt, doc.hashedPassword), true);
        //                 done();
        //             });
        //
        //         });
        // });
    });

    describe('GET list' + constants.USERS_BASE_URL, function () {
        // it('get 403', function (done) {
        //     request(app)
        //         .get(constants.USERS_BASE_URL)
        //         .expect('Content-Type', /json/)
        //         .expect(constants.RESPONSE_CODE.FORBIDDEN)
        //         .end(function (err, res) {
        //             assert.equal(err, null, err);
        //             const resp = JSON.parse(res.text);
        //             assert.strictEqual(resp.code, constants.RESPONSE_CODE.FORBIDDEN);
        //             assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.FORBIDDEN);
        //             done();
        //         });
        // });
        // it('get 200', function (done) {
        //     request(app)
        //         .get(constants.USERS_BASE_URL)
        //         .expect('Content-Type', /json/)
        //         .expect(constants.RESPONSE_CODE.OK)
        //         .end(function (err, res) {
        //             const resp = JSON.parse(res.text);
        //             //log.info(resp);
        //             assert.strictEqual(resp.code, constants.RESPONSE_CODE.OK);
        //             assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.OK);
        //
        //             let user = resp.data[0];
        //             assert.strictEqual(user.username, 'username1');
        //             done();
        //         });
        // });
    });

    describe('GET entity' + constants.USERS_BASE_URL, function () {
        // it('get 403', function (done) {
        //     request(app)
        //         .get(constants.USERS_BASE_URL+"/username1")
        //         .expect('Content-Type', /json/)
        //         .expect(constants.RESPONSE_CODE.FORBIDDEN)
        //         .end(function (err, res) {
        //             assert.equal(err, null, err);
        //             const resp = JSON.parse(res.text);
        //             assert.strictEqual(resp.code, constants.RESPONSE_CODE.FORBIDDEN);
        //             assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.FORBIDDEN);
        //             done();
        //         });
        // });

        // it('get 200', function (done) {
        //     request(app)
        //         .get(constants.USERS_BASE_URL+"/username1")
        //         .expect('Content-Type', /json/)
        //         .expect(constants.RESPONSE_CODE.OK)
        //         .end(function (err, res) {
        //             const resp = JSON.parse(res.text);
        //             log.info(resp);
        //             assert.strictEqual(resp.code, constants.RESPONSE_CODE.OK);
        //             assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.OK);
        //
        //             let user = resp.data;
        //             assert.strictEqual(user.username, 'username1');
        //             done();
        //         });
        // });
        // it('get 404', function (done) {
        //     request(app)
        //         .get(constants.USERS_BASE_URL+"/not_existing_username")
        //         .expect('Content-Type', /json/)
        //         .expect(constants.RESPONSE_CODE.NOT_FOUND)
        //         .end(function (err, res) {
        //             const resp = JSON.parse(res.text);
        //             log.info(resp);
        //             assert.strictEqual(resp.code, constants.RESPONSE_CODE.NOT_FOUND);
        //             assert.strictEqual(resp.message, constants.RESPONSE_MESSAGE.NOT_FOUND);
        //             done();
        //         });
        // });
    });
});