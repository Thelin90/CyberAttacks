//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3'

var result = [], sorted = [], domains=[], svgContainer,
    circles, flag = 0, jsonCircles = [], lastRandom = 0,
    random = 0, text = "";
/**
 * The heart of the application
 */
class App extends Component {
    /*
     * Constructor here to define variables to store data in App State
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
        axios.get('http://localhost:5000/getData')
            .then((response) => this.setState({
                dataObjects: response.data,
                dataFetched: true
            }))
            .catch(function (error) {
                console.log(error);
            });
    }

    /*
     * Count occurrence of a certain object from the fetch.
     */
    countOccurrence() {
        if(domains!=null) {
            for (var i = 0; i < domains.length; ++i) {
                if (!result[domains[i]]) {
                    result[domains[i]] = 0;
                }
                ++result[domains[i]];
            }
        }
    }

    /*
     *  Sort away replicas, example: Kerberos, ..., Kerberos => [Kerberos]!.
     *  Can live without it, but i want to do this for now... helps me to
     *  print the text to the page when iterating
     */
    sortReplicas(unsorted) {
        if(unsorted!=null) {
            var units = unsorted.map((name) => {
                return {count: 1, name: name}
            }).reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count
                return a
            }, {})
            sorted = Object.keys(units).sort((a, b) => units[a] < units[b])
        }
    }


    randomVals(val1) {
        while (val1 === lastRandom) {
            random = Math.floor(Math.random() * 1000 - 50 + 1) + 50;
        }
        lastRandom = random;
        return lastRandom;
    }

    /*
     * Iteration to print random placement of the nodes for the read Domains
     */
    iteration() {
        console.log(domains.length);
        console.log(result.length);

        jsonCircles.push({ "x_axis": 700, "y_axis": 200, "radius": 150, "color" : "green" , "name" : "Domains: " + this.state.dataObjects.length + "\nNodes: " + sorted.length});
        for(var i=1; i < sorted.length; i++) {
            jsonCircles.push({ "x_axis": random = Math.floor(Math.random() * 1000 - 40 + 1) + 50, "y_axis": random = Math.floor(Math.random() * 1000 - 5 + 1) + 100, "radius": 40,
                "color" : "brown" , "name" : sorted[i] + " : " + result[sorted[i]]} );
            text += "\n";
            text += ("{"+sorted[i] + " : " + result[sorted[i]]+"}");
        }
        return text;
    }

    setSvgContainer() {
        if (flag === 0) {
            flag = 1;
            svgContainer = d3.select("body").append("svg")
                .attr("width", 2000)
                .attr("height", 2000)
                .attr("class", "axis")
        }
    }


    /*
     * Tell the application that it will contain circles.
     */
    setCircle() {
        circles = svgContainer.selectAll("circle")
            .data(jsonCircles)
            .enter()
            .append("circle");

        this.setCircleAttributes();
    }

    /*
     *  Make sure every each circle get the correct values, notice
     *  no looping, this is done the correct way.
     */
    setCircleAttributes() {
        circles
            .attr("cx", function (d) { return d.x_axis; })
            .attr("cy", function (d) { return d.y_axis; })
            .attr("r", function (d) { return d.radius; })
            .style("fill", function(d) { return d.color; });
    }

    /*
     * Make sure the text is set to the circles from the given attribut.
     */
    setTextToCirle() {

        /*
        * I want to use this, but i don't get it right now
        */
        /*
        var transform = d3Transform()
            .translate(function(d) { return [20, d.size * 10] })
            .rotate(40)
            .scale(function(d) { return d.size + 2 });
        */

        circles = svgContainer.selectAll("text")
            .data(jsonCircles)
            .enter()
            .append("text")
            .attr("x", function(d) { return d.x_axis-30; })
            .attr("y", function(d) { return d.y_axis; })
            .text( function (d) { return d.name; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "black");
    }

    /*
     * Function to reset some basic variables used within the application.
     */
    resetValues() {
        text = "";
        result = [];
        jsonCircles = [];
        sorted = [];
        domains = []
    }

    /*
     * Reset the svg container, so it re-writes when the application is run twice, or a third time.
     */
    resetSVG() {
        if(svgContainer!=null) {

            svgContainer.selectAll("*").remove();
        }
    }

    /*
     * Here i push the data from the domains from the fetch, also handeleing all the
     * graphical output and function calls.
     */
    render() {

        this.state.dataObjects.map((objects) => {
            console.log("domain: " + objects);
            domains.push("AuthProtocol: "+objects.AuthProtocol);
            domains.push("Domain: "+objects.Domain);
            domains.push("DateTime: "+objects.DateTime);
            domains.push("Destination: "+objects.Destination);
            domains.push("EventID: "+objects.EventID);
            domains.push("LogFile: "+objects.LogFile);
            domains.push("LogonType: "+objects.LogonType);
            domains.push("Source: "+objects.Source);
            domains.push("Type: "+objects.Type);
            domains.push("User: "+objects.User);
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
                    {this.sortReplicas(domains)}
                    {this.resetSVG()}
                    {this.iteration()}
                    {this.setSvgContainer()}
                    {this.setCircle()}
                    {this.setTextToCirle()}
                    {this.resetValues()}
                </p>

            </div>
        );
    }
}
export default App;