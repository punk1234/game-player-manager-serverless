/**
 * @enum ResponseMessage
 */
export enum ResponseMessage {
    // SUCCESS
    SUCCESS = 'Success',
    OK = 'Ok',
    CREATED = 'New resource created',
    ACCEPTED = 'Accepted',

    // ERRORS
    ERR_BAD_REQUEST = 'Bad Request',
    ERR_UNAUTHENTICATED = 'Unauthenticated Error',
    ERR_CONFLICT = 'Conflict Error',
    ERR_NOT_FOUND = 'Not Found Error',
    ERR_UNPROCESSABLE = 'Unprocessable Entity Error',
    ERR_TOO_MANY_REQUEST = 'Too Many Requests Error',
    ERR_SERVER = 'Server Error',

    ERR_INVALID_CREDENTIALS = 'Invalid user credentials!'
};
