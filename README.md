
# webrtc-transmitter

## Description
<a></a>
<H4>
Sample project for transmitting video/audio stream with ffmpeg/gstreamer over WebRTC.
<br>
This project has 3 parts:
</H4>
1 - server : node server that doing the WebRTC [signaling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling) process.
<br>
2 - transmitter - node simple app that streaming rtsp video stream (other stream also can be used)
<br> 
3 - client - react application for displaying the stream.
<br>
<br>

 * I use [NATS](https://nats.io/) for messaging system between the server and transmitter. 
 * I use [GraphQL](https://graphql.org/) for the client - server communication.

## Prerequisites

1 - Install [Gstreamer](http://www.ffmpeg.org/) to your local machine.
<br>
2 - Install [Docker](https://www.docker.com/get-started) to your local machine.
<br>
3 - Install [Docker Compose](https://docs.docker.com/compose/install/) to your local machine.
<br>
4 - Install [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) to your local machine.

## Running

```bash
# start nats 
$ cd docker 
$ docker-compose -d up

# start server 
$ yarn start:server

# start transmiter 
$ yarn start:transmitter

# start client 
$ yarn start:client

```
<p>
 * Navigate to <a href="http://localhost:3000/">http://localhost:3000/</a>
</p>

## Running
* Add ffmpeg example
