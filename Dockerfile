FROM i386/alpine:3.14
WORKDIR /tmp
RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    xvfb && \
    printf 'https://dl-cdn.alpinelinux.org/alpine/v3.12/main\nhttps://dl-cdn.alpinelinux.org/alpine/v3.12/community\n' > /etc/apk/repositories && \
    apk add --no-cache \
    wine
COPY server.key server.crt tts.js /tmp/
RUN git clone https://github.com/uebergucken/DECTalk4_win32_bin.git && mkdir -p /service/cert && mv /tmp/tts.js /service && mv server.key server.crt /service/cert && \
    cd /service && npm install express uuid && mv /tmp/DECTalk4_win32_bin /service;
RUN Xvfb :0 -screen 0 1024x768x16 &
RUN export NODE_ENV=production && export DISPLAY=:0.0 && wineboot
RUN printf '#!/bin/sh\nfind /tmp -mtime +1 -exec rm *.wav *.tts {} \;' > /etc/periodic/daily/tmp_cleanup.sh && chmod +x /etc/periodic/daily/tmp_cleanup.sh
RUN printf '#!/bin/sh\nXvfb :0 -screen 0 1024x768x16 & \nexport DISPLAY=:0.0 \ncd /service && node tts.js' > /start.sh && chmod +x /start.sh

ENTRYPOINT ["/bin/sh", "/start.sh"]
