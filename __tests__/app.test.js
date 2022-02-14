const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')

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
                expect(body.msg).toBe('Error 404 - Route not found');
            })
        })
    })
})