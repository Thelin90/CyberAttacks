/**
 * Created by simon on 2017-03-07.
 *
 *  Here i want to create my store, just did a example above. This is the neat
 *  feature with redux i like.
 */
import { applyMiddleWare, createStore} from "redux"

import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducer from "./reducers"

const middleware = applyMiddleWare(promise(), thunk, logger())

export default createStore(reducer, middleware)