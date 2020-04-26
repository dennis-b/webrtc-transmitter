import { Injectable } from "@nestjs/common";
import { connect, Client } from 'nats'

@Injectable()
export class MessagesService {
    private nc: Client;

    constructor() {
        this.nc = connect({ json: true })
    }

    publish({ payload, topic }) {
        this.nc.publish(topic, payload);
    }

    sendRequest({ payload, topic, onResponse }: { payload: any, topic: string, onResponse?: (msg) => void }) {
        this.nc.request(topic, payload, (msg) => {
            console.log(msg)
            onResponse && onResponse(msg);
        })
    }


}
