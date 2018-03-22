import Request from "request-promise";


let API = {
    getRoomById(id) {
        var options = {
            uri: 'http://localhost:8003/api/room/' + id,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };

        return new Promise((resolve, reject) => {
            Request(options)
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