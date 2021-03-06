const Post = require('./../../../models/postModel').Post;
const {assertTrue, assertFalse, assertIsNull, assertIsObject} = require('./../../utils');

module.exports.ensurePageDoesNotExistsByUniqueKey = async function (page) {
    if (!page.uniqueKey) {
        throw 'uniqueKey is empty!';
    }
    await Post.findOne({uniqueKey: page.uniqueKey}).exec()
        .then(post => assertIsNull(post))
        .catch(err => assertIsNull(err));
}

module.exports.ensurePageExistsByUniqueKey = async function (page) {
    if (!page.uniqueKey) {
        throw 'uniqueKey is empty!';
    }
    await findPostByUniqueKey(page.uniqueKey)
        .then(post => assertIsObject(post))
        .catch(err => assertIsNull(err))
}

async function findPostByUniqueKey(uk){
    return await Post.findOne({uniqueKey: uk}).exec();
}

module.exports.findPostByUniqueKey = findPostByUniqueKey;