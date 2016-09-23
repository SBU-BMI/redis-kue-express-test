/**
 * From https://ifelse.io/2016/02/23/using-node-redis-and-kue-for-priority-job-processing
 *
 * We'll use kue to connect to Redis and create our first queue
 *
 * If you don't provide any connection configuration, Kue
 * will automatically look for redis at the default, local url.
 * This will break immediately in production (see TODO) so we'll
 * check to see which environment node is running in first.
 * You can see all of the configuration options available here:
 * https://github.com/Automattic/kue#redis-connection-settings
 */

'use strict';

// Redis configuration
let redisConfig;
if (process.env.NODE_ENV === 'production') {
    redisConfig = {
        redis: {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            auth: process.env.REDIS_PASS,
            options: {
                no_ready_check: false
            }
        }
    };
} else {
    redisConfig = {};
}

const kue = require('kue');
const queue = kue.createQueue(redisConfig);

// Helps guard against stuck or stalled jobs:
//queue.watchStuckJobs(6000);
// Which is better?
queue.watchStuckJobs(1000 * 10);

queue.on('ready', () => {
    // If you need to
    console.info('Queue is ready!');
});

queue.on('error', (err) => {
    // handle connection errors here
    console.error('There was an error in the main queue!');
    console.error(err);
    console.error(err.stack);
});

// Set up UI
// TODO: export KUE_PORT=6379
//kue.app.listen(process.env.KUE_PORT);
//kue.app.set('title', 'Kue');

function createPayment(data, done) {
    queue.create('payment', data)
        .priority('critical')
        .attempts(8)
        .backoff(true)
        .removeOnComplete(false)
        .save((err) => {
            if (err) {
                console.error(err);
                done(err);
            }
            if (!err) {
                done();
            }
        });
}

/*
 // Processing Jobs
 //...
 queue.process('payment', (job, done) => {
 // This is the data we sent into the #create() function call earlier
 // We're setting it to a constant here so we can do some guarding against accidental writes
 const data = job.data;
 //... do other stuff with the data.
 });
 //...
 */

// Process up to 20 jobs concurrently
queue.process('payment', 20, function (job, done) {
    // other processing work here
    // ...
    // ...

    // Call done when finished
    done();
});

module.exports = {
    create: (data, done) => {
        createPayment(data, done);
    }
};
