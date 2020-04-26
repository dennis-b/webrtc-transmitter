import { subscribeOnDataForSource } from "../gstreamer/gstreamer.utils";

const { RTCVideoSource } = require('wrtc').nonstandard;
const TIME_TO_HOST_CANDIDATES = 7000;

export function onGstreamerConnection({ peerConnection }) {
    const source = new RTCVideoSource();
    const track = source.createTrack();
    peerConnection.addTransceiver(track);

    const unsubscribe = subscribeOnDataForSource({ source });

    const { close } = peerConnection;
    peerConnection.close = function () {
        unsubscribe();
        track.stop();
        return close.apply(peerConnection, arguments);
    };
}

export async function waitUntilIceGatheringStateComplete(peerConnection) {
    if (peerConnection.iceGatheringState === 'complete') {
        return;
    }

    const deferred: any = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    const timeout = setTimeout(() => {
        peerConnection.removeEventListener('icecandidate', onIceCandidate);
        deferred.reject(new Error('Timed out waiting for host candidates'));
    }, TIME_TO_HOST_CANDIDATES);

    function onIceCandidate({ candidate }) {
        if (!candidate) {
            clearTimeout(timeout);
            peerConnection.removeEventListener('icecandidate', onIceCandidate);
            deferred.resolve();
        }
    }

    peerConnection.addEventListener('icecandidate', onIceCandidate);

    await deferred.promise;
}

export function descriptionToJSON(description, shouldDisableTrickleIce) {
    return !description ? {} : {
        type: description.type,
        sdp: shouldDisableTrickleIce ? disableTrickleIce(description.sdp) : description.sdp
    };
}

export function disableTrickleIce(sdp) {
    return sdp.replace(/\r\na=ice-options:trickle/g, '');
}
