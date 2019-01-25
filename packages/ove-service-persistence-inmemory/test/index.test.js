const path = require('path');
const request = require('supertest');
const express = require('express');
const app = express();
const HttpStatus = require('http-status-codes');

const srcDir = path.join(__dirname, '..', 'src');
const { Constants } = require(path.join(srcDir, './server/constants/inmemory'));
const { Utils } = require('@ove-lib/utils')(Constants.APP_NAME, app);
const log = Utils.Logger(Constants.SERVICE_NAME);

log.debug('Using Express JSON middleware');
app.use(express.json());
require(path.join(srcDir, 'server', 'api'))(app, log, Utils);

// Separate section for process.env tests
describe('The OVE Persistence Service - InMemory', () => {
    /* jshint ignore:start */
    // current version of JSHint does not support async/await
    it('should be able to successfully set, get and delete keys', async () => {
        let res = await request(app).post('/core/foo')
            .send({ value: 10, type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(Utils.JSON.EMPTY);

        res = await request(app).get('/core/foo');
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(JSON.stringify({ value: 10, type: 'number', timestamp: 100 }));

        res = await request(app).get('/core');
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(JSON.stringify({ 'foo': 100 }));

        res = await request(app).get('/');
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(JSON.stringify({ 'core/foo': 100 }));

        res = await request(app).post('/core/bar')
            .send({ value: 10, type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(Utils.JSON.EMPTY);

        res = await request(app).get('/core/bar');
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(JSON.stringify({ value: 10, type: 'number', timestamp: 100 }));

        res = await request(app).delete('/core/foo');
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(Utils.JSON.EMPTY);

        res = await request(app).get('/core/foo');
        expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);

        res = await request(app).get('/foo');
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(Utils.JSON.EMPTY);
    });

    it('should fail on all invalid requests', async () => {
        let res = await request(app).post('/core/foo')
            .send({ value: 10, timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.text).toEqual(JSON.stringify({ error: 'invalid item' }));
        res = await request(app).post('/core/foo')
            .send({ type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.text).toEqual(JSON.stringify({ error: 'invalid item' }));
        res = await request(app).post('/core/foo')
            .send({ value: 10, type: 'number' });
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.text).toEqual(JSON.stringify({ error: 'invalid item' }));
        res = await request(app).post('/')
            .send({ value: 10, type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.text).toEqual(JSON.stringify({ error: 'key not provided' }));
        res = await request(app).post('/core')
            .send({ value: 10, type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.text).toEqual(JSON.stringify({ error: 'invalid key' }));

        res = await request(app).delete('/');
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.text).toEqual(JSON.stringify({ error: 'key not provided' }));
        res = await request(app).delete('/foo');
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.text).toEqual(JSON.stringify({ error: 'invalid key' }));
        res = await request(app).delete('/foo/bar');
        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.text).toEqual(JSON.stringify({ error: 'invalid key' }));

        res = await request(app).get('/foo/bar')
            .send({ value: 10, type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        expect(res.text).toEqual(JSON.stringify({ error: 'key not found' }));

        res = await request(app).post('/foo/bar')
            .send({ value: 10, type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.text).toEqual(Utils.JSON.EMPTY);
        res = await request(app).delete('/foo/foo')
            .send({ value: 10, type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        expect(res.text).toEqual(JSON.stringify({ error: 'key not found' }));
        res = await request(app).get('/foo/foo')
            .send({ value: 10, type: 'number', timestamp: 100 });
        expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        expect(res.text).toEqual(JSON.stringify({ error: 'key not found' }));
    });
    /* jshint ignore:end */
});
