export class StringBuilder {
    private strings: string[];

    constructor(value) {
        this.strings = [];
        this.append(value);
    }

    append(value) {
        value && this.strings.push(value);
        return this;
    }

    toString() {
        return this.strings.join("");
    }

}
