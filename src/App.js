//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
var d3 = require('d3');

/*
 * Variables used within the application
 */
var flag = true;
var domainCounter = 0, edgeCounter = 0, linkCounter = 0;
var sources = [], destinations = [], eventID = [], result = [], domains = [];
var simulation;

/*
 * Will hold the information about each domain!
 */
var  data = {
    "nodes": [],
    "links": []
};

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

    /**
     *  Count how often a certain attribut occurrs
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
    /**
     *  Sort away replicas, example: Kerberos, ..., Kerberos => [Kerberos]!.
     *  Can live without it, but i want to do this for now... helps me to
     *  print the text to the page when iterating
     */
    sortReplicas(array) {
        if(array!=null) {
            var units = array.map((name) => {
                return {count: 1, name: name}
            }).reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count
                return a
            }, {})
            array = Object.keys(units).sort((a, b) => units[a] < units[b])
        }
        return array;
    }

    /**
     * Start the functionality from this.
     */
    start() {
        this.countOccurrence();
        console.log(result);
        this.createEdgeAndLinks(sources);
        this.createEdgeAndLinks(destinations);
        this.createEdgeAndLinks(eventID);
        flag=false;
        this.componentDidMount();
        document.getElementById("button").disabled=true;
    }

    /**
     * Hook the D3 component to this, creates all given attributes such as svg, circles,
     * links, labels.
     *
     * Make sure the location is updated with d3-force.
     */
    componentDidMount() {
        if(!flag) {
            const {width, height} = this.props;

           simulation = d3.forceSimulation(data.nodes)
                .force("links", d3.forceLink(data.links).distance(700))
                .force("charge", d3.forceManyBody().strength(-120))
                .force('center', d3.forceCenter(width / 2, height / 2));

            const svg = d3.select(this.refs.mountPoint)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

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
                .style('stroke', '#000000')
                .style('stroke-width', 1.5)
                .style("fill", function (d) {
                    return d.color
                })
                .call(d3.drag()
                    .on("start", this.dragstarted)
                    .on("drag", this.dragged)
                    .on("end", this.dragended));

           const label = svg.selectAll("text")
               .data(data.nodes)
               .enter()
               .append("text")
               .text(function (d) { return d.text; })
               .style("text-anchor", "left")
               .style("fill", "#060005")
               .style("font-family", "Arial")
               .style("font-size", 20);

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


    /**
     * This only works a couple of seconds... BONUS!
     * @param d
     */
    static dragstarted(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    /**
     * This only works a couple of seconds... BONUS!
     * @param d
     */
    dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    /**
     * This only works a couple of seconds... BONUS!
     * @param d
     */
    static dragended(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    /**
     *  Creates the edges and calls addLink for the given link
     *  to a specified source.
     */
    createEdgeAndLinks(array) {
        for (var i = 0; i < array.length; i++) {
            data.nodes.push({
                "EdgeID": edgeCounter,
                "Source": array[i],
                "text": array[i],
                "color": "green"
            });
            edgeCounter++;
        }
        var source = [];
        var target = 0;

        for(var j=0; j<array.length; j++) {
            this.addLink(source, target, array[j], array);
            source = [];
            target = 0;
        }
    }

    /**
     * Done the hard way, looks way more nice with some edges.
     * Add the link for a given source, destination or whatever
     * is called upon the function.
     * @param source
     * @param target
     * @param check
     */
    addLink(source, target, check, array) {
        var color = "";
        for(var k=0; k<array.length; k++) {
            for (var j = 0; j < (domainCounter+edgeCounter); j++) {
                /*
                 * Find the source from the domain!
                 */
                if (data.nodes[j].Source === check && data.nodes[j].EventID > 0 && data.nodes[j].EdgeID === -1) {
                    source.push(j);
                    color = "red";
                }
                /*
                 * Find the target from the edge!
                 */
                if (data.nodes[j].Source === check && data.nodes[j].EdgeID >= 0) {
                    target = j;
                }
                /*
                 * Find the source from the domain!
                 */
                if (data.nodes[j].Destination === check && data.nodes[j].EventID > 0 && data.nodes[j].EdgeID === -1) {
                    source.push(j);
                    color = "purple";
                }
                /*
                 * Find the target from the edge!
                 */
                if (data.nodes[j].Destination === check && data.nodes[j].EdgeID >= 0) {
                    target = j;
                }

                /*
                 * Find the eventID from the domain!
                 */
                if (parseInt(data.nodes[j].EventID, 10) === parseInt(check, 10) && data.nodes[j].EdgeID === -1) {
                    source.push(j);
                    color = "yellow";
                }
                /*
                 * Find the target from the edge!
                 */
                if (parseInt(data.nodes[j].EventID, 10) === check && data.nodes[j].EdgeID >= 0) {
                    target = j;
                }
            }
            /*
             * Add the link!
             */
            console.log(color);
            for (var p = 0; p < source.length; p++) {
                data.links.push({
                    "source": source[p],
                    "target": target,
                    "value": source + "-" + target,
                    "color": color
                });
                linkCounter++;
            }
        }
    }

    /**
     * Render the application
     *
     * @returns {XML}
     */
    render() {

        const {width, height } = this.props;
        const style = {
            width,
            height,
            margin: "100px",
            marginHeight: "300px",
            border: '1px solid #323232',
            backgroundColor: "#abb3bf",
        };
        this.state.dataObjects.map((objects) => {
            document.getElementById("button").disabled=false;
            data.nodes.push({
                "id": domainCounter,
                "AuthProtocol": objects.AuthProtocol,
                "Domain": objects.Domain,
                "DateTime": objects.DateTime,
                "text": "Domain[" + domainCounter + "]",
                "Destination": objects.Destination,
                "EventID": objects.EventID,
                "LogFile": objects.LogFile,
                "LogonType": objects.LogonType,
                "Source": objects.Source,
                "Type": objects.Type,
                "User": objects.User,
                "EdgeID": -1,
                "color": "blue"
            });
            domainCounter++;

            domains.push(
                objects.AuthProtocol,
                objects.Domain,
                objects.DateTime,
                objects.Destination,
                objects.EventID,
                objects.LogFile,
                objects.LogonType,
                objects.Source,
                objects.Type,
                objects.User
            );

            sources.push(objects.Source);
            sources = this.sortReplicas(sources);
            destinations.push(objects.Destination);
            destinations = this.sortReplicas(destinations);
            eventID.push(objects.EventID);
            eventID = this.sortReplicas(eventID);

            return {
                return: console.log("OK current domains read from python_flask <-> OrientDB: CyberAttacks: "+(sources.toString() + " Domains: " + domainCounter +
                    " edges: " + edgeCounter + " links: " +linkCounter + " sources: " + sources.toString()))
            }
        });

        return (
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Welcome to React with D3! Relational graph!</h2>
            <div style={style} ref="mountPoint">
                <button className="button" id='button' onClick={() => this.start()}>Render</button>
                <u1 className="u1" >Purple: Destination & Red: Source. Blue is the main domain the cyber-attack. Green is the edges that show a certain value for the Source or Destination. Yellow is for EventID.</u1>
            </div>
        </div>
        );
    }
}
export default App;