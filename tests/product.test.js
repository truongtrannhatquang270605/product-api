const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');

beforeAll(async () => {
    const uri = process.env.MONGO_URI || '';
    if (!uri.includes('_test')) {
        throw new Error('MONGO_URI phai tro toi DB co hau to _test, hien la: "' + uri + '"');
    }
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        appName: 'product-api-test',
    });
    await Product.init();
    await Product.deleteMany({});
}, 30000);

afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.connection.close();
}, 30000);

describe('Product CRUD', () => {
    const sample = { pid: 1, pname: 'Laptop', price: 1500, quantity: 10 };

    test('GET /health trả 200', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
    });

    test('POST tạo sản phẩm', async () => {
        const res = await request(app).post('/api/products').send(sample);
        expect(res.statusCode).toBe(201);
        expect(res.body.pname).toBe('Laptop');
    });

    test('POST thiếu trường bắt buộc trả 400', async () => {
        const res = await request(app).post('/api/products').send({ pid: 2 });
        expect(res.statusCode).toBe(400);
    });

    test('GET danh sách', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });

    test('GET một sản phẩm theo pid', async () => {
        const res = await request(app).get('/api/products/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.pid).toBe(1);
    });

    test('PUT cập nhật giá', async () => {
        const res = await request(app).put('/api/products/1').send({ price: 1400 });
        expect(res.statusCode).toBe(200);
        expect(res.body.price).toBe(1400);
    });

    test('DELETE xóa sản phẩm', async () => {
        const res = await request(app).delete('/api/products/1');
        expect(res.statusCode).toBe(200);
    });

    test('GET sau khi xóa trả 404', async () => {
        const res = await request(app).get('/api/products/1');
        expect(res.statusCode).toBe(404);
    });
});