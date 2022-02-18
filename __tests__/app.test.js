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

describe('/api/articles/', () => {
    describe('GET', () => {
        test('status: 200 - responds with all article objects', () => {
            return request(app)
            .get('/api/articles/')
            .expect(200)
            .then(( {body : {articles} } ) => {
                expect(articles).toBeSortedBy("created_at", {
                    descending: true,
                });
                expect(articles).toHaveLength(12);
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                 });
                });
        })  
    })
})

describe('/api/articles/:id', () => {
    describe('GET', () => {
        test('status: 200 - responds with an article object depending on ID of article.', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                    expect(response.body.article).toMatchObject({
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: 11,
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

describe('/api/articles/:id/comments', () => {
    describe('GET', () => {
        test('status: 200 - responds with an comments object if article ID is valid.', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then((response) => {
                expect(response.body.comments).toHaveLength(2)
                response.body.comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    })
                })
            })
        })
        test('status: 200 - responds with an comments object depending on ID of article.', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then((response) => {
                    expect(response.body.comments[0]).toEqual({
                        comment_id: 10,
                        author:  'icellusedkars',
                        body: 'git push origin master',
                        created_at: '2020-06-20T07:24:00.000Z',
                        votes: 0,
                    })
            })
        })
        test('status: 400 - responds with a 400 error if article id is invalid', () => {
            return request(app)
            .get('/api/articles/newarticle/comments')
            .expect(400).then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            })
        })
        test('status 200 - returns an empty array if article id is valid but article has no comments', () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then((response) => {
                expect(response.body.comments).toHaveLength(0);
                expect(response.body.comments).toEqual([]);
              });
          });
        test('status: 404 - responds with a 404 error if article_id is invalid', () => {
            return request(app)
            .get('/api/articles/1000/comments')
            .expect(404).then(({ body }) => {
                expect(body.msg).toBe('Article Not Found');
            })
        })
    })
    describe('POST', () => {
        test('status: 201 - responds with a comments object if article ID is valid.', () => {
            const newComment = { username: "rogersop", body: "Bacon ipsum dolor amet burgdoggen venison t-bone swine chicken." }
            return request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
                expect(comment.body).toEqual("Bacon ipsum dolor amet burgdoggen venison t-bone swine chicken.")
            })
        })
        test("status: 404 - responds with 404 error message when username doesn't exist", () => {
			const newComment = { username: "user123", body: "Bacon ipsum dolor amet" }
			return request(app)
				.post('/api/articles/2/comments')
				.send(newComment)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Error: User Not Found')
				})
		})
        test("status: 404: Responds with 404 error when an non existant article id is passed", () => {
            const newComment = { username: "rogersop", body: "This is a test comment" };
            return request(app)
              .post('/api/articles/5555555/comments')
              .send(newComment)
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Page Not Found');
              });
          });
        test('status: 400 - responds with 400 error msg when comment body is empty', () => {
			const newComment = { username: "rogersop" }
			return request(app)
				.post("/api/articles/1/comments")
				.send(newComment)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad Request')
				})
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

