import { loader } from "graphql.macro";

export const Api = {
    Mutations: {
        SignalingOffer: {
            value: loader('./signaling-offer.mutation.graphql'),
            key: 'signalingOffer'
        },
        SignalingAnswer: {
            value: loader('./signaling-offer.mutation.graphql'),
            key: 'signalingAnswer'
        }
    },
    Subscriptions: {
        SignalingRemoteAnswer: {
            value: loader('./signaling-remote-answer.subscription.graphql'),
            key: 'signalingRemoteAnswer'
        }

    }
};
