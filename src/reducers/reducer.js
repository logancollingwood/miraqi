let id = 0;
const initialState = {
    loading: true,
    authorized: true,
    createdAt: '',
    name: '',
    roomProviderType: 'discord',
    messages: [],
    nowPlaying: null,
    users: [],
    id: id,
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
            createdAt: action.data.room.createdAt,
            messages: action.data.room.messages,
            name: action.data.room.name,
            users: action.data.room.users,
            roomProviderType: action.data.room.roomProviderType,
            id: action.data.room._id,
            user: action.data.user,
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
            user: action.data
        });
    case 'NOW_PLAYING' :
        console.log('now playing');
        console.log(action);
        return Object.assign({}, state, {
            nowPlaying: action.data
        });
    default:
      return state
  }
}


export default reducer