const response = require('../../utils/response');
const constants = require('../../constants/constants');
const Post = require('../../models/postModel').Post;
const ValidationErrorResponseSerializer = require('../../models/postModel').ValidationErrorResponseSerializer;
const {populateFromRequestOnCreate} = require("../../models/postModel");
const authMiddleware = require('./../../middleware/auth');

module.exports = function (app) {
    app.post(constants.POSTS_BASE_URL, authMiddleware, async function (req, res) {
        let post = new Post(populateFromRequestOnCreate(req));
        try {
            await post.validate();
        } catch (err) {
            response.sendUnprocessableEntity(res, ValidationErrorResponseSerializer(err))
        }
        post.save()
            .then(post => {
                response.sendOK(res, post, "OK")
            })
            .catch(err => {
                response.sendServerError(err)
            });
    });
};