const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res)=> res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find()
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites); // both parses into JSON and tells that response is ready
        //res.end not needed
        //res.render(error) response .end is implied into this and res.json() 
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
            req.body.forEach(fav => {
                if(!favorite.campsites.includes(fav._id)){
                    favorite.campsites.push(fav._id)
                }

            });
            favorite.save()
            .then(result => {
                res.statusCode =200; 
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            });
        } else {
            Favorite.create({user: req.user._id, campsites: req.body})
            .then(result => {
                res.statusCode = 200; 
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            })
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(response => {
        response.remove()
        .then(result => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        })
    }) // this automatically deletes everying in favorites collection
    //if no favoriteID is passed in 
   
});


favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions,authenticate.verifyUser,  (req, res)=> res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser,  (req, res, next) => {
    Favorite.findById(req.params.campsiteId)
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
                if(!favorite.campsites.includes(req.params.campsiteId)){
                    favorite.campsites.push(req.params.campsiteId)
               
            favorite.save()
            .then(result => {
                res.statusCode =200; 
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
               })
            } else {
                res.end('You already have that campsite as a favorite!')
            };
        } else {
            Favorite.create({user: req.user._id, campsites: req.body})
            .then(result => {
                res.statusCode = 200; 
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            })
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/campsiteId');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(response => {
        if(response){
            if(response.campsites.includes(req.params.campsiteId)){
                response.campsites.splice(response.campsites.indexOf(req.params.campsiteId),1);
            }
        response.save()
        .then(result => {
            res.statusCode =200; 
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
           })
    } else {
        res.send('That favorite was not found')
    }
})
    .catch(err => next(err));
});

module.exports = favoriteRouter;