import * as PubSub from "pubsub-js";

const gstreamer = require('gstreamer-superficial');

import { StringBuilder } from "../utils";
import { Config } from "../config";
import { AppConstants } from "../constants";


const pipeStr = new StringBuilder(`rtspsrc location=${Config.StreamUri}`)
    .append(' latency=0')
    .append(' is-live=true')
    .append(' low-latency=true !')
    .append(' decodebin !')
    .append(' videoconvert !')
    .append(' video/x-raw, format=(string)I420 !')
    .append(' appsink name=sink')


export function startStream() {

    let gsPipeline = new gstreamer.Pipeline(pipeStr);
    let appsink = gsPipeline.findChild('sink');

    const onData = (data, caps) => {
        if (data) {
            PubSub.publish(AppConstants.VIDEO_DATA_RECEIVED, { data, caps });
            appsink.pull(onData);
        } else {
            // setTimeout(() => appsink.pull(onData), 500);
        }
    }

    const stopStream = () => {
        gsPipeline.stop();
        gsPipeline = null;
        appsink = null;
    };

    gsPipeline.pollBus((msg) => {
        if (msg.type === 'eos' || msg.type.includes('ERROR')) {
            stopStream();
            console.log(`restarting stream after : ${msg.type}`)
            setTimeout(() => startStream(), 1000)
        }
    });
    gsPipeline.play();
    appsink.pull(onData);
    return { stopStream };
}

export function subscribeOnDataForSource({ source }) {
    const token = PubSub.subscribe(AppConstants.VIDEO_DATA_RECEIVED, (message, { data, caps }) => {
        const dataArray = new Uint8ClampedArray(data, data.byteOffset, data.byteLength / Uint8ClampedArray.BYTES_PER_ELEMENT)
        source.onFrame({ width: caps.width, height: caps.height, data: dataArray })
    });
    return () => PubSub.unsubscribe(token);
}
