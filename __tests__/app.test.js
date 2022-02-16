const request = require('supertest');
const express = require('express');
const app = require('../app');
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')

app.use(express.json());

beforeEach (() => seed(testData))  
afterAll (()=> db.end())

describe('errors', () => {
    describe('GET', () => {
        test('status: 404 - responds with a 404 if route does not exist.', () => {
            return request(app)
            .get('/api/topic')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Page Not Found');
            })
        })
    })
})

describe('/api/topics', () => {
    describe('GET', () => {
        test('status: 200 - responds with an array of all the topic objects.', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(response.body.topics).toHaveLength(3);
                response.body.topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
        })
        
    })
})

describe('/api/articles/:id', () => {
    describe('GET', () => {
        test('status: 200 - responds with an article object depending on ID of article.', () => {
            return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then((response) => {
                    expect(response.body.article).toMatchObject({
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
            })
        })
        test('status: 400 - responds with a 400 error if article id is invalid', () => {
            return request(app)
            .get('/api/articles/newarticle')
            .expect(400).then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            })
        })
    })
    describe('PATCH', () => {
        test('status: 201 - responds with an incremented vote property', () => {
            const newVote = { inc_votes: 2 };
            return request(app)
            .patch('/api/articles/1')
            .send(newVote)
            .expect(201)
            .then(({ body }) => {
                expect(body.article).toEqual({
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  created_at: "2020-07-09T20:11:00.000Z",
                  votes: 102,
                });
              });
        })
        test('status: 201 - responds with a decremented vote property', () => {
            const newVote = { inc_votes: -20 };
            return request(app)
            .patch('/api/articles/1')
            .send(newVote)
            .expect(201)
            .then(({ body }) => {
                expect(body.article).toEqual({
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  created_at: "2020-07-09T20:11:00.000Z",
                  votes: 80,
                });
              });
        })
    })
})

describe('/api/users', () => {
    describe('GET', () => {
        test('Status 200 - responds with an array of user objects, each of which should have a username property', () => {
            return request(app)
              .get('/api/users')
              .expect(200)
              .then(( {body : {users} } ) => {
                expect(users).toHaveLength(4);
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                    })
                 });
                });
              });
          });
    }) 

