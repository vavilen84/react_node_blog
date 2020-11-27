const response = require('Utils/response');
const constants = require('Constants/constants');
const Post = require('Models/post').Post;

module.exports = function(app) {

    app.delete(constants.POSTS_BASE_URL + "/:id", async function (req, res) {

        let post = await Post.findById(id).exec();
        if (!post) {
            response.sendNotFound(res);
            return;
        }
        post.delete(function (err){
            if (err) {
                response.sendServerError(res);
                return;
            }
            response.sendOK(res, null, "OK")
        });
    });

};