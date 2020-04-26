import { useSubscription } from "@apollo/react-hooks";
import { get } from "lodash";

import { Api } from "../api";
import { createPeerConnection } from "../Stream/stream.utils";

interface SignalingProps {
    onConnectionStateChange: (conn: any) => any
    connectionId: any
    video: any
    onRemoteAnswer: (data: any) => any
}

export function useSignalingSubscription({ onConnectionStateChange, connectionId, video, onRemoteAnswer }: SignalingProps) {

    const onSubscriptionData: any = async ({ subscriptionData: { data } }: any) => {
        console.log('received sdp offer ', data)
        const remoteConnection = get(data, Api.Subscriptions.SignalingRemoteAnswer.key);
        if (remoteConnection.connection) {
            const data = await createPeerConnection({
                remoteConnection,
                onConnectionStateChange,
                video
            });
            // await mutateWebRtcSignallerRequest("answer", data, nestId)
            await onRemoteAnswer({ data })
        }
    };

    useSubscription(Api.Subscriptions.SignalingRemoteAnswer.value, {
        variables: { connectionId },
        onSubscriptionData
    })


}


