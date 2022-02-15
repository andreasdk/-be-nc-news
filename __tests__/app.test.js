const request = require('supertest');
const express = require('express');
const app = require('../app');
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')

app.use(express.json());

beforeEach (() => seed(testData))  
afterAll (()=> db.end())

describe('/api/topics', () => {
    describe('GET', () => {
        test('status: 200 - responds with an array of all the topic objects.', () => {
            return request(app).get('/api/topics').expect(200).then((response) => {
                expect(response.body.topics).toHaveLength(3);
                response.body.topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
        })
        test('status: 404 - responds with a 404 if route does not exist.', () => {
            return request(app).get('/api/topic').expect(404).then(({ body }) => {
                expect(body.msg).toBe('Page Not Found');
            })
        })
    })
})

describe('/api/articles/:id', () => {
    describe('GET', () => {
        test('status: 200 - responds with an article object depending on ID of article.', () => {
            return request(app).get('/api/articles/2').expect(200).then((response) => {
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
        test('status: 404 - responds with a 404 if article id is valid but does not exist.', () => {
            return request(app).get('/api/articles/1000').expect(404).then(({ body }) => {
                expect(body.msg).toBe('Article Not Found');
            })
        })
        test('status: 400 - responds with a 400 error if article id is invalid', () => {
            return request(app).get('/api/articles/newarticle').expect(400).then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            })
        })
    })
})