//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3'

var result = [], sorted = [], text = '', domains=[], svgContainer, circles;

var jsonCircles = [
    { "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
    { "x_axis": 70, "y_axis": 70, "radius": 10, "color" : "purple"},
    { "x_axis": 200, "y_axis": 100, "radius": 30, "color" : "red"}];

class App extends Component {

    /*
    *Define a constructor here to define variables to store data in App State
    */
    constructor(props) {
        super(props);
        this.state = {
            dataObjects: [],
            dataFetched: false
        }
    }

    /*
    *Handle the GET API request
    */
    handleGetData() {
        // Make GET request to a route I got online
        axios.get('http://localhost:5000/getData')
        // Handle the Response object and store Data in App State
        // setState is how we assign values to application state
            .then((response) => this.setState({
                dataObjects: response.data,
                dataFetched: true
            }))
            .catch(function (error) {
                // Error handling
                console.log(error);
            });
    }

    /*
    * Handle displaying data in App
    */
    handleDataDisplay() {
        // If data fetched is false, display 'NO DATA YET'
        if (!this.state.dataFetched) {
            return <div>NO DATA YET</div>
        } else {

            this.state.dataObjects.map((objects) => {
                /*
                * use this to debugg the elements in the console
                * console.log("debugg: ", objects.X); where X = Domain, Network... and so on!
                *
                * use return below when needed
                */
                return (
                    <ul>
                        <li></li>
                    </ul>
                );
            });
        }
    }

    /*
     * Count occurrence of
     */
    countOccurrence() {
        for(var i = 0; i < domains.length; ++i) {
            if(!result[domains[i]]) {
                result[domains[i]] = 0;
            }
            ++result[domains[i]];
        }
        /*
         * For an easier output?
         */

        console.log("totalt: ", result);
        this.sortReplicas(domains);
    }

    /*
     *  Sort away replicas, example: Kerberos, ..., Kerberos => [Kerberos]!.
     *  Can live without it, but i want to do this for now... helps me to
     *  print the text to the page when iterating
     */
    sortReplicas(unsorted) {
        var units = unsorted.map((name) => {
                return {count: 1, name: name}
            }).reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count
                return a
            }, {})
        sorted = Object.keys(units).sort((a, b) => units[a] < units[b])

    }

    iteration() {
        for(var i=1; i < sorted.length; i++) {
            text += "\n";
            text += ("{"+sorted[i] + " : " + result[sorted[i]]+"}");
        }
        return text;
    }

    setSvgContainer() {
        svgContainer = d3.select("body").append("svg")
          .attr("width", 1000)
          .attr("height", 800);

    }


    setCircle1() {
        circles = svgContainer.selectAll("circle")
            .data(jsonCircles)
            .enter()
            .append("circle");
    }

    setCircleAttributes() {
        circles
            .attr("cx", function (d) { return d.x_axis; })
            .attr("cy", function (d) { return d.y_axis; })
            .attr("r", function (d) { return d.radius; })
            .style("fill", function(d) { return d.color; });
    }

    render() {
        /*
        * Here i push all my data to render
        */
        this.state.dataObjects.map((objects) => {
            domains.push(objects.AuthProtocol);
            domains.push(objects.Domain);
            domains.push(objects.DateTime);
            domains.push(objects.Destination);
            domains.push(objects.EventID);
            domains.push(objects.LogFile);
            domains.push(objects.LogonType);
            domains.push(objects.Source);
            domains.push(objects.Type);
            domains.push(objects.User);
            console.log('Objects Domain: ', objects.AuthProtocol);
            return (
                <ul>
                    <li></li>
                    <li>{this.state.dataObjects.toString()}</li>
                </ul>
            );
        });

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React with D3!</h2>
                </div>
                <p className="App-intro">
                    <button onClick={() => this.handleGetData()}>PILLAGE DATA</button>
                    {this.countOccurrence()}
                    <u1>{"\n"+this.iteration()}</u1>
                </p>

                {/* The handleDataDisplay function will handle our logic for what we display */}
                {this.handleDataDisplay()}
                /*
                    lets call the drawing here
                 */
                {this.setSvgContainer()}
                {this.setCircle1()}
                {this.setCircleAttributes()}
            </div>
        );
    }
}
export default App;