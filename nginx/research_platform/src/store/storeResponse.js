export const STATUS = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
}

export class StoreResponse {
    status;
    message;
    data;
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}