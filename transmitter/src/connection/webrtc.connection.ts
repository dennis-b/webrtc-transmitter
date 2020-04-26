import { RTCPeerConnection } from 'wrtc'

import { Connection } from './connection';
import { descriptionToJSON, waitUntilIceGatheringStateComplete } from "./connection.utils";

const TIME_TO_CONNECTED = 10000;
const TIME_TO_RECONNECTED = 3000;

export class WebRtcConnection extends Connection {
    peerConnection: RTCPeerConnection;
    reconnectionTimer: any;
    connectionTimer: any;
    onIceConnection: any;

    constructor(id, options: any = {}) {
        super(id);
        const { onConnection, } = options as any;
        const iceServers: any = [];
        this.peerConnection = new RTCPeerConnection({ iceServers, 'sdpSemantics': 'unified-plan', });

        onConnection({ peerConnection: this.peerConnection, id });
        this.setConnectionTimer()
        this.onIceConnection = this.onIceConnectionStateChange.bind(this)
        this.peerConnection.addEventListener('iceconnectionstatechange', this.onIceConnection);

    }

    get iceConnectionState() {
        return this.peerConnection.iceConnectionState;
    }


    get localDescription() {
        return descriptionToJSON(this.peerConnection.localDescription, true);
    }

    get remoteDescription() {
        return descriptionToJSON(this.peerConnection.remoteDescription, false);
    }

    get signalingState() {
        return this.peerConnection.signalingState;
    }

    async doOffer() {
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            await waitUntilIceGatheringStateComplete(this.peerConnection);
            return offer;
        } catch (error) {
            this.close();
            throw error;
        }
    }

    async applyAnswer(answer) {
        try {
            await this.peerConnection.setRemoteDescription(answer);
        } catch (e) {
            console.error('ERROR setRemoteDescription', e)
        }
    };

    close() {
        this.peerConnection.removeEventListener('iceconnectionstatechange', this.onIceConnection);
        if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
            this.connectionTimer = null;
        }
        if (this.reconnectionTimer) {
            clearTimeout(this.reconnectionTimer);
            this.reconnectionTimer = null;
        }
        this.peerConnection.close();
        super.close();
    };

    setConnectionTimer() {
        this.connectionTimer = setTimeout(() => {
            if (this.peerConnection.iceConnectionState !== 'connected' && this.peerConnection.iceConnectionState !== 'completed') {
                this.close();
            }
        }, TIME_TO_CONNECTED);
    }

    onIceConnectionStateChange() {

        if (this.peerConnection.iceConnectionState === 'connected' || this.peerConnection.iceConnectionState === 'completed') {
            if (this.connectionTimer) {
                clearTimeout(this.connectionTimer);
                this.connectionTimer = null;
            }
            clearTimeout(this.reconnectionTimer);
            this.reconnectionTimer = null;
        } else if (this.peerConnection.iceConnectionState === 'disconnected' || this.peerConnection.iceConnectionState === 'failed') {
            if (!this.connectionTimer && !this.reconnectionTimer) {
                const self = this;
                this.reconnectionTimer = setTimeout(() => {
                    self.close();
                }, TIME_TO_RECONNECTED);
            }
        }
    };

    toJSON() {
        return {
            ...super.toJSON(),
            iceConnectionState: this.iceConnectionState,
            localDescription: this.localDescription,
            remoteDescription: this.remoteDescription,
            signalingState: this.signalingState
        };
    };
}


