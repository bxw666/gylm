#!/bin/bash
source /app/.env
export PATH=~$PATH:/usr/local/bin:/usr/local/openjdk-11/bin:/usr/bin
export JAVA_HOME=/usr/local/openjdk-11/

/app/source_verify_ens_updater/bin/source_verify_ens_updater $ENS_SECRET /app/repository
