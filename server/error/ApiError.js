class ApiError extends Error {
    constructor(status, message, errors =  []) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
        this.timeStamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor); // Для чистоты. Первое это то КУДА записать stack. Второе это с какого места НАЧИНАТЬ записывать stack. С ней логи пойдут с самого места ошибки сразу.
    }

    static badRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static internal(message = "Internal server error") {
        return new ApiError(500, message);
    }

    static forbidden(message = "Forbidden", errors = []) {
        return new ApiError(403, message, errors);
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message)
    }

    static notFound(message = "Not found") {
        return new ApiError(404, message)
    }
}

export default ApiError;