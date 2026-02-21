export class PromptForgeError extends Error {
    constructor(public statusCode: number, message: string, public details?: any) {
        super(message);
        this.name = 'PromptForgeError';
    }
}

export class TimeoutError extends Error {
    constructor(message = 'Request timed out') {
        super(message);
        this.name = 'TimeoutError';
    }
}
