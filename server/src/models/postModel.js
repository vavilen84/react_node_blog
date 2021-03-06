const mongoose = require('../utils/mongoose').Mongoose,
    Schema = mongoose.Schema;
const errorSerializer = require('../utils/modelErrorSerializer').errorSerializer;
const enums = require('../enum/enum');
const constants = require('../constants/constants');

async function uniqueKeyUniqueValidator(v) {
    if (v) {
        let model = getModel();
        let doc = await model.findOne({uniqueKey: v}).exec();
        if (doc) {
            if (doc.id !== this._id.toString()) {
                return false;
            }
        }
    }
    return true;
}

async function urlUniqueValidator(v) {
    let model = getModel();
    let doc = await model.findOne({url: v}).exec();
    if (doc) {
        if (doc.id !== this._id.toString()) {
            return false;
        }
    }
    return true;
}

const uniqueKeyCustomValidators = [
    {validator: uniqueKeyUniqueValidator, msg: constants.VALIDATION_ERRORS.UNIQUE}
]

const urlCustomValidators = [
    {validator: urlUniqueValidator, msg: constants.VALIDATION_ERRORS.UNIQUE}
]

const schemaObj = {
    image: {
        type: String,
        max: 255,
    },
    uniqueKey: {
        type: String,
        max: 255,
        index: {unique: true},
        validate: uniqueKeyCustomValidators,
    },
    url: {
        type: String,
        index: {unique: true},
        required: [true, constants.VALIDATION_ERRORS.REQUIRED],
        validate: urlCustomValidators,
        max: 255,
    },
    title: {
        type: String,
        max: 255,
    },
    relatedPostIds: {
        type: Array,
    },
    tags: {
        type: Array,
    },
    keywords: {
        type: String,
        max: 255,
    },
    description: {
        type: String,
        max: 255,
    },
    greeting: {
        type: String,
    },
    content: {
        type: String,
        required: [true, constants.VALIDATION_ERRORS.REQUIRED],
    },
    status: {
        type: Number,
        enum: [enums.PostStatuses.ACTIVE, enums.PostStatuses.INACTIVE],
        default: enums.PostStatuses.ACTIVE
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
};

const schema = new Schema(schemaObj)

exports.Post = getModel();

function getModel() {
    return mongoose.model(constants.POST_MODEL_NAME, schema);
}

exports.ValidationErrorResponseSerializer = function (err) {
    return errorSerializer(Object.keys(schemaObj), err);
}

exports.populateFromRequestOnCreate = function (formDataFields, imageFilename) {
    return {
        image: imageFilename || null,
        uniqueKey: formDataFields.uniqueKey || null,
        url: formDataFields.url || null,
        title: formDataFields.title || null,
        relatedPostIds: formDataFields.relatedPostIds || [],
        tags: formDataFields.tags || [],
        keywords: formDataFields.keywords || null,
        description: formDataFields.description || null,
        greeting: formDataFields.greeting || null,
        content: formDataFields.content || null,
        status: formDataFields.status || enums.PostStatuses.ACTIVE
    }
}

exports.populateFromRequestOnUpdate = function (req, post) {
    post.image = req.body.image || post.image;
    post.uniqueKey = req.body.uniqueKey || post.uniqueKey;
    post.url = req.body.url || post.url;
    post.title = req.body.title || post.title;
    post.relatedPostIds = req.body.relatedPostIds || post.relatedPostIds;
    post.tags = req.body.tags || post.tags;
    post.keywords = req.body.keywords || post.keywords;
    post.description = req.body.description || post.description;
    post.greeting = req.body.greeting || post.greeting;
    post.content = req.body.content || post.content;
    post.status = req.body.status || post.status;
    post.updatedAt = Date.now();

    return post;
}