"use strict";

const request = require('supertest');
const app = require('../app');
const api = request(app);

const test = require('tape');

const dummyOrder = {
    // This job property lets you make better use of the kue UI — keep reading for more
    title: 'Order #4kSvjL_Qx',
    paymentToken: '4kSvjL_Qx',
    orderID: '1a2b3c4',
    received: true,
    receivedAt: new Date('December 24, 2015 23:59:59'),
    createdAt: new Date('December 24, 2015 23:58:59'),
    productID: '5d6e6f',
    customer: {
        firstName: 'A',
        lastName: 'Person',
        email: 'example@example.com',
        address: '1234 somewhere lane, ? USA 12345'
    }
};

test('Receiving and processing payments', t => {
    api
        .post('/payments')
        .send(dummyOrder)
        .end((err, res) => {
            const order = res.body.order;

            // Check for response body
            t.ok(res.body, 'Should respond with a body');

            // Check for response meta properties
            t.equals(res.body.success, true, 'The success property should be true');
            t.equals(res.body.error, null, 'The error property should be null');
            t.ok(res.body.message, 'Should have a message property');

            // Check to see if the order is intact
            t.equals(order.received, true, 'Should have been received');
            t.equals(order.orderID, dummyOrder.orderID, 'Order ID should be the same');
            t.equals(order.paymentToken, dummyOrder.paymentToken, 'Payment token should be the same');
            t.equals(order.productID, dummyOrder.productID, 'Product ID should be the same');
            t.end();

            // Authpr ran into some unexpected behavior w/ supertest and tape where tape tests would appear to hang,
            // even after calling t.end()
            process.exit();
        });
});
