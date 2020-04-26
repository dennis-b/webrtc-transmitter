import { EventEmitter } from "events";

export class Connection extends EventEmitter {
    id;
    state;

    constructor(id) {
        super();
        this.id = id;
        this.state = 'open';
    }

    close() {
        this.state = 'closed';
        this.emit('closed');
    }

    toJSON() {
        return {
            id: this.id,
            state: this.state
        };
    }
}
