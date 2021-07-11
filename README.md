# DECTalk_webservice
Simple webservice for DECTalk

It is recommended to install this in a container using the included docker-compose files.

Usage:
[your_URL_here]/say?text=[DECTalk text here, including phoneme data etc.] - returns say.wav with the spoken audio.

[your_URL_here]/say?b64&text=[Base64 encoded DECTalk text here w/phoneme data] - returns say.wav with the spoken audio - expects the DECTalk data to be base64 encoded first.
