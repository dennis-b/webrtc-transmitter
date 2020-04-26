import { PubSub } from "graphql-subscriptions";
import { Inject, Injectable } from "@nestjs/common";
import { MessagesService } from "../messages/messages.service";

@Injectable()
export class SignalingService {
    constructor(
        private messagesService: MessagesService,
        @Inject('PUB_SUB') private pubSub: PubSub
    ) {
    }

    onStartNegotiation({ connectionId }) {
        this.messagesService.sendRequest({
            topic: 'startNegotiation',
            payload: { connectionId },
            onResponse: (connection) => {
                this.pubSub.publish('signalingRemoteAnswer', { signalingRemoteAnswer: { connection } })
                // this.pubSub.publish('signalingRemoteAnswer', { signalingRemoteAnswer: { connection: { id: connectionId } } })
            }
        })
    }

    onSdpAnswer({ connectionId, localDescription }) {
        this.messagesService.publish({
            topic: 'sdpAnswer',
            payload: { connectionId, localDescription },
        })
    }

}
