# DECTalk_webservice
Simple webservice for DECTalk

This is a nodejs-based webservice for DECTalk. It assumes you have a server to host it on, a URL to send/receive data with, and SSL certificates.

It is recommended to install this in a container using the included docker-compose files.

Usage:

```[your_URL_here]/say?text=[DECTalk text here, including phoneme data etc.]```

Returns say.wav with the spoken audio.


```[your_URL_here]/say?b64&text=[Base64 encoded DECTalk text here w/phoneme data]```

Returns say.wav with the spoken audio - expects the DECTalk text to be base64 encoded first.


# Twitch integration w/Streamelements and OBS
While there are many use cases for the service, my initial goal was to use this with twitch by issuing !tts commands in the streamer's chatroom and having DECTalk respond. Provided your overlay is already set up (which is well documented) You can create a custom widget in Streamelements containing the following JS code:
```
window.addEventListener("onEventReceived", function ( obj ) {
    const data = obj.detail.event && obj.detail.event.data;
    console.log("data=", data);
    if( !data ) {
        return;
    }

    if( data.text.indexOf("!tts ") !== 0 ) {
        return;
    }

    const text = data.text.substring(5);
    speak(text);
});

function speak( text ) {
    const src = "https://[your_URL_here]/say" + "?b64=1&text=" + btoa(text);
    const audioTag = document.createElement("AUDIO");
    audioTag.src = src;
    audioTag.play();
    document.body.appendChild(audioTag);
    audioTag.addEventListener("ended", () => {
        audioTag.remove();
    });
}
```
