const express = require('express');
const req = require('express/lib/request');
const mongodb = require('mongodb');

const router = express.Router();


// Get Posts 
router.get('/', async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

// Add Post
router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        city: req.body.city,
        time: req.body.time,
        temp: req.body.temp,
        tempType: req.body.tempType,
        createdAt: new Date()
    });
    res.status(201).send();
});

// Delete Post
router.delete('/:id', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)})
    res.status(200).send();
});

async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://rorai123:rorai123@cluster0.vavxj.mongodb.net/Cluster0?retryWrites=true&w=majority', 
    {useNewUrlParser: true});
    return client.db('Cluster0').collection('posts');
}

module.exports = router;