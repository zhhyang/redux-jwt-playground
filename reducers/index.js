import { combineReducers } from 'redux'
import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS,
  QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE,SAVE_APP_TOKEN,
  REFRESHING_TOKEN,DONE_REFRESHING_TOKEN
} from '../actions'


// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
function auth(state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('id_token') ? true : false
  }, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        token:action.id_token
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      })
    case SAVE_APP_TOKEN:
      return Object.assign({}, state,{
        token:action.id_token
      })
    case REFRESHING_TOKEN:
      return Object.assign({}, state, {
        freshTokening: true,
        freshTokenPromise: action.freshTokenPromise
      })
    case DONE_REFRESHING_TOKEN:
      return Object.assign({}, state, {
        freshTokening: false,
        isAuthenticated: true,
        freshTokenPromise:null,
        token:action.id_token
      })
    default:
      return state
    }
}

// The quotes reducer
function quotes(state = {
    isFetching: false,
    quote: '',
    authenticated: false
  }, action) {
  switch (action.type) {
    case QUOTE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case QUOTE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        quote: action.response,
        authenticated: action.authenticated || false
      })
    case QUOTE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false
      })
    default:
      return state
  }
}

// We combine the reducers here so that they
// can be left split apart above
const quotesApp = combineReducers({
  auth,
  quotes
})

export default quotesApp
