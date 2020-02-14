const express = require('express');
const bodyParser = require('body-parser');

const campsiteRouter = express.Router();

campsiteRouter.use(bodyParser.json());

campsiteRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the campsites to you');
})
.post((req, res) => {
    res.end(`Will add the campsite: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res) => {
    res.end('Deleting all campsites');
});

campsiteRouter.route('/:campsiteID').all((req,res,next)=>{
    res.statusCode = 200; 
    res.setHeader('Content-Type', 'text/plain'); 
    next(); 
}).get((req,res)=>{
    res.end(`will send details of the campsite ${req.params.campsiteID} to`);
}).post((req,res)=> {
    res.statusCode = 403; 
    res.end(`POST operation not supported on campsite/${req.params.campsiteID}`);
}).put((req,res)=>{
    res.write('Updating the campsite' + req.params.campsiteID)
    res.end(`Will update the campsite: ${req.body.name}
    with description: ${req.body.description}`);
}).delete((req,res)=>{
    res.end(`Deleting campsite: ${req.params.campsiteID}`);
});


module.exports = campsiteRouter;