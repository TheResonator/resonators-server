import express from '../express';
import routeHandler from '../routeHandler';
import {updateFollowerUser, getLeaderFollowers, addLeaderFollower, deleteLeaderFollower} from '../../application/leaderFollowers';
import userRepository from '../../db/repositories/UserRepository' ;

express.get('/leader_followers\.:ext?', routeHandler(async (request, response) => {
    const {user} = request.appSession;

    const followers = await getLeaderFollowers(user.id);

    response.status(200);
    response.json(followers);
}));

express.post('/leader_followers\.:ext?', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    let followerRequest = request.body;
    followerRequest = {...followerRequest, leader_id: leader.id};

    const follower = await addLeaderFollower(followerRequest);

    response.status(201);
    response.json(follower);
}));

express.put('/leader_followers/:followerId\.:ext?', routeHandler(async (request, response) => {
    const {user: userRequest, leader} = request.body;
    const {followerId} = request.params;

    await updateFollowerUser(followerId, userRequest);

    response.status(200);
    response.json({});
}, {
    enforceLeaderFollower: true
}));

express.delete('/leader_followers/:followerId\.:ext?', routeHandler(async (request, response) => {
    const {followerId} = request.params;

    await deleteLeaderFollower(followerId);

    response.status(200);
    response.json({});
}, {
    enforceLeaderFollower: true
}));
