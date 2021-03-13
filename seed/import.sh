#!/usr/bin/env bash

mongoimport --host meetups-mongo --db meetups --collection users --type json --file /seed/users.json --jsonArray
mongoimport --host meetups-mongo --db meetups --collection meetups --type json --file /seed/meetups.json --jsonArray
mongoimport --host meetups-mongo --db meetups --collection comments --type json --file /seed/comments.json --jsonArray