import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from 'redux';
import promise from "redux-promise-middleware";

/*
 * redux way of fetching the data, but i don't get it right when i split this up.
 *
 * Worth mentioning is that i am very used to
 */
const initialState = {
    fetching: false,
    fetched: false,
    users: [],
    error: null,
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case "FETCH_USERS_PENDING": {
            return {... state, fetching: true}
            break;
        }
        case "FETCH_USERS_REJECTED": {
            return {... state, fetching: false, error: action.payload}
            break;
        }
        case "RECEIVE_USERS_FULFILLED": {
            return {
                ...state,
                fetching: false,
                fetched: true,
                users: action.payload,
            }
            break;
        }
    }
    return state;
}


const middleware = applyMiddleware(promise(), thunk, logger())
const store = createStore(reducer, middleware)

/*
 * i really like the promise thing, this is where i actually store
 * stuff to my store, i think? The promise() is really really nice, i like this.
 */
store.dispatch({
    type: "FETCH_USERS",
    payload: axios.get("http://localhost:5000/getData")
})

class App extends Component {

    constructor(props) {
        super(props);
    }

    /*
     * JS -fetch, work fine, but how to store this data?
     */
    fetchData() {
        fetch('http://localhost:5000/getData').then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function(data) {
                    console.log(data);
                });
            }
        ).catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    }

    render() {
        return (
            <div className="App">
                <h1>CyberAttacks</h1>
                <button onClick={() => this.fetchData()}>Get Domains</button>
            </div>
        );
    }
}
export default App;