#!/bin/sh
SECRET=$(grep "^CRON_SECRET=" /opt/onia-platform/app.env | cut -d= -f2 | tr -d "\"\r")
curl -fsS --max-time 60 -H "Authorization: Bearer $SECRET" https://app.onia.com.bo/api/cron/trial-drip
