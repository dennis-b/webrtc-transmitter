import { loader } from "graphql.macro";

export const Api = {
    Mutations: {
        RequestStream: {
            value: loader('./request-stream.mutation.graphql'),
            key: 'requestStream'
        },
        SignalingAnswer: {
            value: loader('./signaling-answer.mutation.graphql'),
            key: 'signalingAnswer'
        }
    },
    Subscriptions: {
        SignalingRemoteOffer: {
            value: loader('./signaling-remote-offer.subscription.graphql'),
            key: 'signalingRemoteOffer'
        }

    }
};
