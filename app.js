var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8181;
var _ = require('underscore');
var userNextId = 4;

var users = [{
    id:1,
    username: 'user1',
    password: 'password',
    isAdmin: true
},{
    id:2,
    username: 'user2',
    password: 'password',
    isAdmin: false
},{
    id:3,
    username: 'user3',
    password: 'password',
    isAdmin: false
}]

app.use(bodyParser.json());

app.get('/users', function(req, res) {
    var queryParams = req.query;
    var filterUsers = users; 
    if (queryParams.hasOwnProperty('admin') && queryParams.admin === 'true') {
        filterUsers = _.where(filterUsers, {isAdmin:true});
    }
    else if (queryParams.hasOwnProperty('admin') && queryParams.admin === 'false') {
        filterUsers = _.where(filterUsers, {isAdmin:false});
    }
    
    res.json(filterUsers);
})

app.get('/users/:id', function(req, res) {
    var userId = parseInt(req.params.id, 10);
    var user = _.findWhere(users, {id:userId});
    if (user) {
        res.json(user);
    }  else {
        res.status(404).send();
    }
})

app.post('/users', function(req, res) {
    var user = req.body;
    user.id = userNextId++;
    users.push(user);
    res.json(users);
})

app.delete('/users/:id', function (req, res) {
    var userId = parseInt(req.params.id, 10);
    var user = _.findWhere(users, {id:userId});
    
    if(!user) {
        res.status(404).send();
    }
    else {
        users = _.without(users, user);
        res.json(user);
    }
})

app.put('/users/:id', function (req, res) {
    var userId = parseInt(req.param.id, 10);
    var user = _.findWhere(users, {id:userId});
    var body = _.pick(req.body, 'username', 'password', 'isAdmin');
    var normalizeUser = {};
    if (!user) {
        return res.status(404).send();
    }
    if (body.hasOwnProperty('isAdmin') && _.isBoolean(body.isAdmin)) {
        normalizeUser.isAdmin = body.isAdmin;
    }
    else if (body.hasOwnProperty('isAdmin')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('username') && _.isString(body.username)) {
        normalizeUser.username = body.username;
    }
    else if (body.hasOwnProperty('username')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('password') && _.isString(body.password)) {
        normalizeUser.password = body.password;
    }
    else if (body.hasOwnProperty('password')) {
        return res.status(400).send();
    }

    _.extend(user, normalizeUser);
    res.json(user);
})

app.listen(port);