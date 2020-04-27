import React, { useRef, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { v4 as uuid } from "uuid";

import { StRoot, StStartStream, StVideo } from "./styled";
import { Api } from "../api";
import { useSignalingSubscription } from "../hooks/useSignalingSubscription";

export function Stream() {

    const [connectionId, setConnectionId] = useState(uuid());
    const [haveStream, setHaveStream] = useState(false);
    const videoRef = useRef<any>();
    const [requestStream, { loading: requestStreamLoading }] = useMutation(Api.Mutations.RequestStream.value);
    const [sdpAnswer, { loading: answerLoading }] = useMutation(Api.Mutations.SignalingAnswer.value);

    useSignalingSubscription({
        connectionId,
        onConnectionStateChange: ({ iceConnectionState }) => console.log(`stream state : ${iceConnectionState}`),
        video: videoRef.current,
        onRemoteAnswer: async data => {
            await sdpAnswer(data)
            setHaveStream(true)
        }
    })

    const onRequestStream = async () => {
        try {
            await requestStream({ variables: { connectionId } })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <StRoot>
            {!haveStream &&
            <StStartStream onClick={onRequestStream}>
                START STREAM
            </StStartStream>
            }

            <StVideo
                haveStream={haveStream}
                autoPlay={true}
                ref={videoRef}
            />

        </StRoot>
    )

}
