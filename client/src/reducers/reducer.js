let id = 0;
const initialState = {
    loading: true,
    authorized: false,
    createdAt: '',
    name: '',
    roomProviderType: 'discord',
    messages: [],
    room: null,
    nowPlaying: null,
    users: [],
    id: id,
    queue: [],
    stats: null,
    user: {
        guilds: []
    },
}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
        return Object.assign({}, state, {
            messages: [
                ...state.messages,
                action.data
            ]
        })
    case 'UPDATE_ROOM':
        return Object.assign({}, state, {
            room: action.data.room,
            createdAt: action.data.room.createdAt,
            messages: action.data.room.messages,
            name: action.data.room.name,
            users: action.data.room.users,
            roomProviderType: action.data.room.roomProviderType,
            id: action.data.room._id,
            user: action.data.user,
            queue: action.data.room.queue,
            stats: action.data.stats,
            loading: false
        });
    case 'NOT_AUTH': 
        return Object.assign({}, state, {
            authorized: false
        });
    case 'SET_USER': 
        console.log(action);
        return Object.assign({}, state, {
            loading: false,
            authorized: true,
            user: action.data
        });
    case 'NOW_PLAYING' :
        console.log('now playing');
        console.log(action);
        return Object.assign({}, state, {
            nowPlaying: action.data
        });
    case 'NEW_QUEUE' : 
        return Object.assign({}, state, {
            queue: action.data
        })
    case 'IS_SKIPPING' : 
        return Object.assign({}, state, {
            skipping: action.data
        })
    case 'NEW_STATS' : 
        return Object.assign({}, state, {
            stats: action.data
        })
    default:
      return state
  }
}


export default reducer