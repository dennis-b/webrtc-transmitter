import React, { useRef, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { v4 as uuid } from "uuid";

import { StRoot, StStartStream, StVideo } from "./styled";
import { Api } from "../api";
import { useSignalingSubscription } from "../hooks/useSignalingSubscription";

export function Stream() {

    const [connectionId, setConnectionId] = useState(uuid());
    const videoRef = useRef<any>();
    const [sdpOffer, { loading: offerLoading }] = useMutation(Api.Mutations.SignalingOffer.value);
    const [sdpAnswer, { loading: answerLoading }] = useMutation(Api.Mutations.SignalingAnswer.value);

    useSignalingSubscription({
        connectionId,
        onConnectionStateChange: ({ iceConnectionState }) => console.log(iceConnectionState),
        video: videoRef.current,
        onRemoteAnswer: data => sdpAnswer(data)
    })

    const sendOffer = async () => {
        try {
            await sdpOffer({ variables: { connectionId } })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <StRoot>
            <StStartStream
                onClick={sendOffer}
            >
                START STREAM
            </StStartStream>

            <StVideo
                autoPlay={true}
                ref={videoRef}
            />

        </StRoot>
    )

}
