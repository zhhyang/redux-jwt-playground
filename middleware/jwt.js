import { refreshToken } from '../actions/auth';
import jwtDecode from 'jwt-decode';
import moment from 'moment'
import {CALL_API} from './api'
const MIN_TOKEN_LIFESPAN = 30
function checkTokenFreshness(token) {
  let tokenPayload = jwtDecode(token);
  let expiry = moment.unix(tokenPayload.exp);
  let diff = expiry.diff(moment(), 'seconds')
  console.log(diff);
  return  diff < MIN_TOKEN_LIFESPAN;
}
export default function jwt({ dispatch, getState }) {

    return (next) => (action) => {

        const callAPI = action[CALL_API]

        // So the middleware doesn't get applied to every single action
        if (typeof callAPI === 'undefined' || !callAPI.authenticated) {
          return next(action)
        }


        if (getState().auth && getState().auth.token) {

            if (checkTokenFreshness(getState().auth.token)) {

                // make sure we are not already refreshing the token
                if (!getState().auth.freshTokenPromise) {
                    return refreshToken(dispatch).then(() => next(action));
                } else {
                    return getState().auth.freshTokenPromise.then(() => next(action));
                }
            }
        }

        return next(action);
    };
}
