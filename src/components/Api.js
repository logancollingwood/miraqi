import Request from "request-promise";

const API_BASE_URL = 'http://localhost:8003/api/';
let API_OPTIONS = {
    uri: API_BASE_URL,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};


let API = {
    getRoomById(id) {
        API_OPTIONS.method = 'GET';
        API_OPTIONS.uri = API_BASE_URL + 'room/' + id;

        return new Promise((resolve, reject) => {
            Request(API_OPTIONS)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(err) {
                reject(err);
            });
        });
    },

    createRoom(roomRequest) {
        API_OPTIONS.method = 'POST';
        API_OPTIONS.uri = API_BASE_URL + 'room/';
        API_OPTIONS.body = roomRequest;

        return new Promise((resolve, reject) => {
            Request(API_OPTIONS)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(err) {
                reject(err);
            });
        });
    },

    getNextSongForRoom(roomId, currentlyPlayingId) {
        const body = {
            roomId: roomId,
            currentlyPlayingId: currentlyPlayingId
        }

        API_OPTIONS.method = 'POST';
        API_OPTIONS.uri = API_BASE_URL + 'room/next';
        API_OPTIONS.body = body;

        console.log(API_OPTIONS);
        return new Promise((resolve, reject) => {
            Request(API_OPTIONS)
            .then(function(response) {
                resolve(response);
            })
            .catch(function(err) {
                reject(err);
            });
        });
    }
}

module.exports = API;