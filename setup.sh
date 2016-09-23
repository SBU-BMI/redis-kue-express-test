#!/bin/bash

#
# Based on instructions from https://ifelse.io/2016/02/23/using-node-redis-and-kue-for-priority-job-processing/
# Adapted for personal development machine.
# This shell is just a helper, it's far from perfect, use at own risk! Better make some modifications first!
#

cd ~/github

# created github repo online and then:
git clone https://github.com/SBU-BMI/redis-kue-express-test
cd redis-kue-express-test
npm init
npm install --save express kue
npm install -g generator-express

# what are our options?
# express -h

# create scaffolding
express

rm -rf views
echo "remove the 'jade': 'X.X.X' entry from your package.json"
echo
echo "following lines from your app.js:"
echo "var users = require('./routes/users');"
echo "app.set('views', path.join(__dirname, 'views'));"
echo "app.set('view engine', 'jade');"
echo "app.use('/users', users);"
echo

# Important - this is not listed in the tutorial, but you need it!
# npm install serve-favicon morgan cookie-parser --save
# It's in package.json

# install testing tools
npm install --save-dev supertest tape
# failing test to gauge our progress
mkdir test && cd $_ && touch payments.js

echo "Add code to test/payment.js and run 'node test/*.js'"
echo "Should give you a failing test - this is OK for now."

# RUN REDIS
redis-server &
# port 6379 (the default port)

echo "Important TODO! export KUE_PORT=6379"

mkdir queue && cd $_ && touch payments.js

# https://github.com/Automattic/kue#failure-backoff
# https://github.com/Automattic/kue#json-api

# run your app with node bin/www
# http://localhost:3000/
