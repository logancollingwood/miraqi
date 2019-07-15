enum SocketMessageType {
    ADD_MESSAGE = 'ADD_MESSAGE',
    UPDATE_ROOM = 'UPDATE_ROOM',
    NOT_AUTH = 'NOT_AUTH',
    SET_USER = 'SET_USER',
    NOW_PLAYING = 'NOW_PLAYING',
    NEW_QUEUE = 'NEW_QUEUE',
    NO_QUEUE = 'NO_QUEUE',
    IS_SKIPPING = 'IS_SKIPPING',
    NEW_STATS = 'NEW_STATS',
}

module.exports.SocketMessageType = SocketMessageType;
export default SocketMessageType;