#!/bin/bash
redis="redis-server"
$redis &
web=`npm start`
