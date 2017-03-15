//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
var d3 = require('d3');

var flag = true;
var domainCounter = 0, edgeCounter = 0, linkCounter = 0;

var sources = [], destinations = [];

/*
 * Will hold the information about each domain!
 */
var  data = {
    "nodes": [],
    "links": []
};

var domains = [];
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
        document.getElementById("button").disabled=true;
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
     *
    countOccurrence() {
        if(domains!=null) {
            for (var i = 0; i < domains.length; ++i) {
                if (!result[domains[i]]) {
                    result[domains[i]] = 0;
                }
                ++result[domains[i]];
            }
        }
    }*/

    /*
     *  Sort away replicas, example: Kerberos, ..., Kerberos => [Kerberos]!.
     *  Can live without it, but i want to do this for now... helps me to
     *  print the text to the page when iterating
     */
    sortReplicas() {
        if(sources!=null) {
            var units = sources.map((name) => {
                return {count: 1, name: name}
            }).reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count
                return a
            }, {})
            sources = Object.keys(units).sort((a, b) => units[a] < units[b])
        }
    }

    /*
    randomVals(val1) {
        while (val1 === lastRandom) {
            random = Math.floor(Math.random() * 1000 - 50 + 1) + 50;
        }
        lastRandom = random;
        return lastRandom;
    }*/

    /*
     * Iteration to print random placement of the nodes for the read Domains
     *
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
    }*/

    /*
    setSvgContainer() {
        if (flag === 0) {
            flag = 1;
            svgContainer = d3.select("body").append("svg")
                .attr("width", 2000)
                .attr("height", 2000)
                .attr("class", "axis")
        }
    }
    */

    /*
     * Tell the application that it will contain circles.
     *
    setCircle() {
        circles = svgContainer.selectAll("circle")
            .data(jsonCircles)
            .enter()
            .append("circle");

        this.setCircleAttributes();
    }/

    /*
     *  Make sure every each circle get the correct values, notice
     *  no looping, this is done the correct way.
     *
    setCircleAttributes() {
        circles
            .attr("cx", function (d) { return d.x_axis; })
            .attr("cy", function (d) { return d.y_axis; })
            .attr("r", function (d) { return d.radius; })
            .style("fill", function(d) { return d.color; });
    }
    /
    /*
     * Make sure the text is set to the circles from the given attribut.
     */
  //  setTextToCirle() {

        /*
        * I want to use this, but i don't get it right now
        */
        /*
        var transform = d3Transform()
            .translate(function(d) { return [20, d.size * 10] })
            .rotate(40)
            .scale(function(d) { return d.size + 2 });
        */
/*
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
    }*/

    /*
     * Function to reset some basic variables used within the application.
     *
    resetValues() {
        text = "";
        result = [];
        jsonCircles = [];
        sorted = [];
        domains = []
    }*/

    /*
     * Reset the svg container, so it re-writes when the application is run twice, or a third time.
     *
    resetSVG() {
        if(svgContainer!=null) {

            svgContainer.selectAll("*").remove();
        }
    }*/





    /*
     * Here i push the data from the domains from the fetch, also handeleing all the
     * graphical output and function calls.
     *
     *             domains.push("AuthProtocol: "+objects.AuthProtocol);
     domains.push("Domain: "+objects.Domain);
     domains.push("DateTime: "+objects.DateTime);
     domains.push("Destination: "+objects.Destination);
     domains.push("EventID: "+objects.EventID);
     domains.push("LogFile: "+objects.LogFile);
     domains.push("LogonType: "+objects.LogonType);
     domains.push("Source: "+objects.Source);
     domains.push("Type: "+objects.Type);
     domains.push("User: "+objects.User);
     */

    start() {
        flag=false;
        this.componentDidMount();
        document.getElementById("button").disabled=true;
    }
    /*
     * D3 hook on to this
     */
    componentDidMount() {
        if(!flag) {
            const {width, height} = this.props;

            d3.forceSimulation(data.nodes)
                .force("links", d3.forceLink(data.links).distance(50))
                .force("charge", d3.forceManyBody().strength(-120))
                .force('center', d3.forceCenter(width / 2, height / 2));

            const svg = d3.select(this.refs.mountPoint)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            console.log(data.links.color);

            const link = svg.selectAll('line')
                .data(data.links)
                .enter()
                .append('line')
                .style('stroke-width', 3.5)
                .style('stroke', function (d) {
                    return d.color
                })
                .style('stroke-opacity', 0.6);

            const node = svg.selectAll("circle")
                .data(data.nodes)
                .enter()
                .append("circle")
                .attr("r", 10)
                .style('stroke', '#FFFFFF')
                .style('stroke-width', 3.5)
                .style("fill", function (d) {
                    return d.color
                });

           const label = svg.selectAll("text")
               .data(data.nodes)
               .enter()
               .append("text")
               .text(function (d) { return d.text; })
               .style("text-anchor", "middle")
               .style("fill", "#bf3823")
               .style("font-family", "Arial")
               .style("font-size", 15);

            d3.forceSimulation().on('tick', () => {

                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });

                label
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    });


            });
        }

        if(flag) {
            flag=false;
            this.handleGetData();
        }
    }

    render() {

        const {width, height } = this.props;
        const style = {
            width,
            height,
            margin: "100px",
            marginHeight: "300px",
            border: '1px solid #323232',
        };

        this.state.dataObjects.map((objects) => {
            document.getElementById("button").disabled=false;
            data.nodes.push({
                "id": domainCounter,
                "AuthProtocol": objects.AuthProtocol,
                "Domain": objects.Domain,
                "DateTime": objects.DateTime,
                "text": "Domain[" + domainCounter + "] : {" + objects.Source + "}",
                "Destination": objects.Destination,
                "EventID": objects.EventID,
                "LogFile": objects.LogFile,
                "LogonType": objects.LogonType,
                "Source": objects.Source,
                "Type": objects.Type,
                "User": objects.User,
                "color": "blue"
            });

            sources.push(objects.Source);
            this.sortReplicas();

            destinations.push(objects.Source);

            console.log(sources);

            for(var i=0; i<sources.length; i++) {

                if (sources[i] === objects.Source) {
                    console.log("sources[j]: " + sources[i]);
                    console.log("objects.Source: " + objects.Source);

                    data.nodes.push({
                        "id": "Edge" + edgeCounter,
                        "Source": sources[i],
                        "text": sources[i],
                        "color": "green"
                    });

                    console.log("edge: " + sources[i]);
                    edgeCounter++;

                    data.links.push({
                        "source": 1,
                        "target": 0,
                        "value": sources[i],
                        "color": "red"
                    });

                    linkCounter++;
                }
            }
            domainCounter++;
            return {
                return: console.log("OK current domains read from python_flask <-> OrientDB: CyberAttacks: "+(sources.toString() + " Domains: " + domainCounter + " edges: " + edgeCounter + " links: " +linkCounter))
            }
        });

        return (
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Welcome to React with D3! Relational graph!</h2>
            <div style={style} ref="mountPoint">
                <button className="button" id='button' onClick={() => this.start()}>Render</button>
            </div>
        </div>
        );
    }
}
export default App;