import { RTCPeerConnection, RTCSessionDescription } from 'wrtc';

const enableStereoOpus = (sdp) => sdp.replace(/a=fmtp:111/, 'a=fmtp:111 stereo=1\r\na=fmtp:111');

export const createPeerConnection = async ({ remoteConnection, onConnectionStateChange, video }) => {

    const { connection, turn } = remoteConnection;
    const { id, localDescription } = connection;
    // const { iceServers } = JSON.parse(turn.body);

    const options: any = { stereo: false };

    const configuration = { 'sdpSemantics': 'unified-plan', };
    const localPeerConnection = new RTCPeerConnection(configuration);

    try {
        await localPeerConnection.setRemoteDescription(localDescription);
        setVideoStream({ localPeerConnection, video });
        const originalAnswer = await localPeerConnection.createAnswer();
        const sdp = options.stereo ? enableStereoOpus(originalAnswer.sdp) : originalAnswer.sdp;
        await localPeerConnection.setLocalDescription(new RTCSessionDescription({ type: 'answer', sdp }));
        localPeerConnection.oniceconnectionstatechange = (evt) => onConnectionStateChange({ evt, localPeerConnection });
        const { localDescription: { sdp: localDescriptionSdp } } = localPeerConnection as any;
        return { connectionId: id, localDescription: localDescriptionSdp };
    } catch (error) {
        console.error('create connection error', error)
        localPeerConnection.close();
        throw error;
    }
}


const setVideoStream = ({ localPeerConnection, video }) => {
    const tracks = localPeerConnection.getReceivers().map(receiver => receiver.track);
    video.srcObject = new MediaStream(tracks);
    const { close } = localPeerConnection;
    localPeerConnection.close = function () {
        localPeerConnection.ondatachannel = null;
        video.srcObject = null;
        return close.apply(this, arguments);
    };
}


