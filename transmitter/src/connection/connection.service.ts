import { Injectable } from "@nestjs/common";
import { MessagesService } from "../messages/messages.service";
import { ConnectionManager } from "./connection.manager";
import { onGstreamerConnection } from "./connection.utils";

@Injectable()
export class ConnectionService {

    connectionManager = new ConnectionManager()

    constructor(private messagesService: MessagesService) {
        this.subscribeOnStartNegotiation()
        this.subscribeOnSdpAnswer()
    }

    subscribeOnStartNegotiation() {
        this.messagesService.subscribe({ topic: 'startNegotiation', callback: this.onStartNegotiation.bind(this) })
    }

    async onStartNegotiation(msg, reply, subject, sid) {
        const { connectionId } = msg;
        const connection = await this.connectionManager.createConnection({
            connectionId,
            options: { onConnection: onGstreamerConnection }
        })
        if (reply) {
            this.messagesService.publish({ topic: reply, payload: { connection } })
        }
    }

    subscribeOnSdpAnswer() {
        this.messagesService.subscribe({ topic: 'sdpAnswer', callback: this.onSdpAnswer.bind(this) })
    }


    async onSdpAnswer(msg) {
        const { connectionId, localDescription } = msg;
        const connection = this.connectionManager.getConnection(connectionId);
        if (!connection) {
            console.log(`Connection not Found for ${connectionId}`)
            return;
        }
        const answer = { type: 'answer', sdp: localDescription }
        await connection.applyAnswer(answer);
    }


}
