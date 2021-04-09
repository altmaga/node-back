/*
Imports
*/
const { session } = require('passport');
const Models = require('../models/index');
//

/*
CRUD methods
*/
const createOne = req => {
    return new Promise((resolve, reject) => {
        Models.comment.create(req.body)
            .then(data => {
                resolve(data)
                Models.post.findById(data.post)
                .then(post => {
                    post.comments.push(data);

                    post.save()
                    .then( updatedPost => resolve(updatedPost) )
                    .catch( updateError => reject(updateError) )
                })
            })
            .catch(err => reject(err))
    })
}

const readAll = () => {
    return new Promise((resolve, reject) => {
        // Mongoose population to get associated data
        Models.comment.find()
            .populate('author', ['-password'])
            .populate('likes')
            .exec((err, data) => {
                if (err) { return reject(err) }
                else { return resolve(data) }
            })
    })
}

const readOne = id => {
    return new Promise((resolve, reject) => {
        // Mongoose population to get associated data
        Models.comment.findById(id)
            .populate('author', ['-password'])
            .populate('likes')
            .exec((err, data) => {
                if (err) { return reject(err) }
                else { return resolve(data) }
            })
    })
}

const updateOne = req => {
    return new Promise((resolve, reject) => {
        // Get comment by ID
        Models.comment.findById(req.body.id)
            .then(comment => {

                // check user
                if (String(comment.author) !== String(req.user._id)) {
                    reject('User not authorized')
                }

                // Update object
                comment.content = req.body.content;
                comment.dateModified = new Date();

                // Save comment changes
                comment.save()
                    .then(updatedComment => resolve(updatedComment))
                    .catch(updateError => reject(updateError))
            })
            .catch(err => reject(err))
    })
}

const deleteOne = req => {
    return new Promise((resolve, reject) => {
        Models.comment.findById(req.params.id)
            .then(comment => {
                // check user
                if (String(comment.author) !== String(req.user._id)) {
                    reject('User not authorized')
                }
                // Delete object
                Models.comment.findByIdAndDelete(req.params.id, (err, deleted) => {
                    if (err) { return reject(err) }
                    else { return resolve(deleted) };
                })

            })
            .catch(err => reject(err));
    });
}

const readAllFromPost = postId => {
    return new Promise((resolve, reject) => {
        // Mongoose population to get associated data
        Models.comment.find({ post: postId })
            .populate('comment', ['content', 'author'])
            .populate('author', ['-password'])
            .exec((err, data) => {
                if (err) { return reject(err) }
                else { return resolve(data) }
            })
    })
}
//

/*
Export controller methods
*/
module.exports = {
    readAll,
    readOne,
    // readAllFromPost,
    createOne,
    updateOne,
    deleteOne
}
//
