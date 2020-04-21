#!/bin/bash

# Start the run once job.
echo "Docker container has been started"

# Run daemon in the background
ipfs init
ipfs daemon &  

# Setup a cron schedule
echo "*/2 * * * * /app/publish_to_ipfs.sh >> /var/log/cron.log 2>&1
# This extra line makes it a valid cron" > scheduler.txt

crontab scheduler.txt
cron -f
