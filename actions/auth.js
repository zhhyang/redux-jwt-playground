import axios from 'axios'
import { DONE_REFRESHING_TOKEN, REFRESHING_TOKEN, SAVE_APP_TOKEN } from './'

function saveAppToken (token) {
  return {
    type: SAVE_APP_TOKEN,
    isAuthenticated: true,
    id_token: token
  }
}
export function refreshToken (dispatch) {
  let body = {
    username: 'dani',
    password: 'dani'
  }
  var freshTokenPromise = axios.post('http://localhost:3001/sessions/create', body)
    .then(t => {

      const data = t.data
      dispatch(saveAppToken(data.id_token))
      localStorage.setItem('id_token', data.id_token)
      dispatch({
        type: DONE_REFRESHING_TOKEN,
        id_token: data.id_token
      })
      return data.id_token ? Promise.resolve(data.id_token) : Promise.reject({
        message: 'could not refresh token'
      })
    })
    .catch(e => {

      console.log('error refreshing token', e)

      dispatch({
        type: DONE_REFRESHING_TOKEN
      })
      return Promise.reject(e)
    })

  dispatch({
    type: REFRESHING_TOKEN,

    // we want to keep track of token promise in the state so that we don't try to refresh
    // the token again while refreshing is in process
    freshTokenPromise
  })

  return freshTokenPromise
}
