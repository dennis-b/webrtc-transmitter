'use strict';

import { WebRtcConnection } from "./webrtc.connection";


export class ConnectionManager {
    private closedListeners: Map<any, any>;
    private connections: Map<any, any>;

    constructor() {
        this.connections = new Map();
        this.closedListeners = new Map();
    }

    deleteConnection(connection) {
        // 1. Remove "closed" listener.
        const closedListener = this.closedListeners.get(connection);
        this.closedListeners.delete(connection);
        connection.removeListener('closed', closedListener);

        // 2. Remove the Connection from the Map.
        this.connections.delete(connection.id);
    }

    createConnection = async ({ connectionId, options }) => {
        const connection = new WebRtcConnection(connectionId, options);

        // 1. Add the "closed" listener.
        const closedListener = () => this.deleteConnection(connection);

        // const listener = closedListener.bind(this)

        this.closedListeners.set(connection, closedListener);
        connection.once('closed', closedListener);

        // 2. Add the Connection to the Map.

        this.connections.set(connection.id, connection);

        await connection.doOffer()
        return connection;
    };


    getConnection(id) {
        return this.connections.get(id) || null;
    };

    getConnections() {
        return Array.from(this.connections.values());
    };

}
