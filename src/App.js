import React, { Component } from 'react';
import ReactDOM from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

var Chart = require('./Chart');

var sampleData = [
    {id: '5fbmzmtc', x: 7, y: 41, z: 6},
    {id: 's4f8phwm', x: 11, y: 45, z: 9},
    // ...
];



var counter = 0;

class App extends Component {

    // Define a constructor here to define variables to store data in App State
    constructor(props) {
        super(props);
        this.state = {
            data: sampleData,
            domain: {x: [0, 30], y: [0, 100]},
            dataObjects: [],
            indexValues: {AuthProtocol: '', DateTime: '', Destination: '', Domain: '', EventID: parseInt(''.substring(''.length - 1), 10), LogFile: '', LogonType: parseInt(''.substring(''.length - 1), 10), Source: '', Type: '', User: ''},
            dataFetched: false
        }
    }

    // Handle the GET API request
    handleGetData() {
        // Make GET request to a route I got online
        axios.get('http://localhost:5000/getData')
        // Handle the Response object and store Data in App State
        // setState is how we assign values to application state
            .then((response) => this.setState({
                dataObjects: response.data,
                dataFetched: true,
                data: sampleData,
                domain: {x: [0, 30], y: [0, 100]}
            }))
            .catch(function (error) {
                // Error handling
                console.log(error);
            });
    }

    // Handle displaying data in App
    handleDataDisplay() {

        var printSomeStuff = 'exampleCss';
        var authProtocol = '';


        // If data fetched is false, display 'NO DATA YET'
        if (!this.state.dataFetched) {
            return <div>NO DATA YET</div>
        } else {

            this.state.dataObjects.map((objects) => {


                this.authProtocol = objects.AuthProtocol;

                console.log('Hmm: ', this.authProtocol); // works?
/*
                console.log('DATA IN MEMORY OBJ AuthProtocol: ', objects.AuthProtocol);
                console.log('DATA IN MEMORY OBJ DateTime: ', objects.DateTime);
                console.log('DATA IN MEMORY OBJ Destination: ', objects.Destination);
                console.log('DATA IN MEMORY OBJ EventID: ', objects.EventID);
                console.log('DATA IN MEMORY OBJ Domain: ', objects.Domain);
                console.log('DATA IN MEMORY OBJ LogFile: ', objects.LogFile);
                console.log('DATA IN MEMORY OBJ LogonType: ', objects.LogonType);
                console.log('DATA IN MEMORY OBJ Source: ', objects.Source);
                console.log('DATA IN MEMORY OBJ Type: ', objects.Type);
                console.log('DATA IN MEMORY OBJ User: ', objects.User);
                */



                if(this.authProtocol === ('NTLM')) {
                    console.log("length: ", this.state.dataObjects.length);
                    counter++;
                }


                console.log("count auth: ", counter);

                return (
                    <div>

                    <hl>
                        <li>hej</li>
                    </hl>
                    </div>
                );
            });
        }
    }

    render() {
        console.log('DATA IN MEMORY: ', this.state.dataObjects); // Console log so you can check the response Object from API
        console.log('DATA IN MEMORY: ', this.state.dataObjects.Domain); // does not work! Aha!
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    <button onClick={() => this.handleGetData()}>PILLAGE DATA</button>
                    <li>{}</li>


                </p>
                <Chart
                    data={this.state.data}
                    domain={this.state.domain}
                />
                {/* The handleDataDisplay function will handle our logic for what we display */}
                {this.handleDataDisplay()}
            </div>
        );
    }
}

export default App;