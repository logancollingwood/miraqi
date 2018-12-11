export const addMessage = (data) => ({
	type: "ADD_MESSAGE",
	data: data
});

/* Used only by actions for sockets */
export const updateRoom = (data) => ({
	type: "UPDATE_ROOM",
	data: data
});

export const notAuthorized = (data) => ({
    type: "NOT_AUTH",
    data: {}
});

export const setUser = (user) => ({
    type: "SET_USER",
    data: user
})

export const nowPlaying = (trackName) => ({
    type: "NOW_PLAYING",
    data: trackName
})

export const updateQueue = (queue) => ({
    type: "NEW_QUEUE",
    data: queue
})

export const setSkipping = (skipping) => ({
    type: "IS_SKIPPING",
    data: skipping
})

export const setStats = (stats) => ({
    type: "NEW_STATS",
    data: stats
})