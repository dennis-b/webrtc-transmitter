
# webrtc-transmitter

## Description
Sample project for transmitting video/audio stream with ffmpeg/gstreamer over WebRTC.
<br>
This project has 3 parts:
<br>
<br>
1 - <b>server</b> : node server that doing the WebRTC [signaling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling) process.
<br>
2 - <b>transmitter</b> - node simple app that streaming rtsp video stream (other stream also can be used)
<br> 
3 - <b>client</b> - react application for displaying the stream.
<br>
<br>

 * I use [NATS](https://nats.io/) for messaging system between the server and transmitter. 
 * I use [GraphQL](https://graphql.org/) for the client - server communication.

## Prerequisites

1 - Install [Gstreamer](https://gstreamer.freedesktop.org/download/).
<br>
2 - Install [Docker](https://www.docker.com/get-started).
<br>
3 - Install [Docker Compose](https://docs.docker.com/compose/install/).
<br>
4 - Install [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable).

## Installation

```bash
# install server 
$ cd server 
$ yarn

# install transmiter 
$ cd transmitter 
$ yarn

# install client 
$ cd client 
$ yarn

```

## Running

<b>* from root folder: </b>

```bash
# start nats 
$ cd docker 
$ docker-compose -d up

# start server 
$ yarn start:server

# start transmitter 
$ yarn start:transmitter

# start client 
$ yarn start:client

```
<p>
 * Open <a href="http://localhost:3000/">http://localhost:3000/</a> to view it in browser
</p>

## TODO
* Add ffmpeg example
