export const AddMessageAction = (data) => ({
	type: "ADD_MESSAGE",
	data: data
});

/* Used only by actions for sockets */
export const UpdateRoomAction = (data) => ({
	type: "UPDATE_ROOM",
	data: data
});

export const NotAuthorizedAction = (data) => ({
    type: "NOT_AUTH",
    data: {}
});

export const SetUserAction = (user) => ({
    type: "SET_USER",
    data: user
})

export const NowPlayingAction = (trackName) => ({
    type: "NOW_PLAYING",
    data: trackName
})

export const UpdateQueueAction = (queue) => ({
    type: "NEW_QUEUE",
    data: queue
})

export const SetSkippingAction = (skipping) => ({
    type: "IS_SKIPPING",
    data: skipping
})

export const SetStatsAction = (stats) => ({
    type: "NEW_STATS",
    data: stats
})