#!/bin/bash

# Spin up a selenium instance.
selenium-standalone start &
SELENIUM_PID=$!
sleep 5

# Run the tests against this Selenium instance we just stood up
nightwatch -e default nightwatch.json

# Stop Selenium
kill -SIGINT "$SELENIUM_PID"
#kill -SIGINT $(pgrep --parent "$XVFB_PID" node)
