/**
 * Created by simon on 2017-03-09.
 */

// Chart.js
/*import React from 'react';
import d3 from 'react-d3-library';

var node = document.createElement('div');

var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select(node).append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json("flare.json", function(error, root) {
    if (error) throw error;

    var bubbles = svg.selectAll(".node")
        .data(bubble.nodes(classes(flare))
            .filter(function (d) {
                return !d.children;
            }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
});

*/
class Chart extends Component {

 /*   constructor(props) {
        super(props);
        this.state = {
            data: React.PropTypes.array,
            domain: React.PropTypes.object
        }
    }

    componentDidMount() {
        var el = ReactDom.findDOMNode(this);
        this.create(el, {
            width: '100%',
            height: '300px'
        }, this.getChartState());
    }

    componentDidUpdate() {
        var el = ReactDom.findDOMNode(this);
        this.update(el, this.getChartState());
    }

    getChartState() {
        return {
            data: this.props.data,
            domain: this.props.domain
        };
    }

    componentWillUnmount() {
        var el = ReactDom.findDOMNode(this);
        this.remove(el);
    }

    render() {
        return (
            <div className="Chart"></div>
        );
    }

    create(el, props, state) {
       // var svg = rd3.select(el).append('svg')
        var svg = d3.select(el).append('svg')
            .attr('class', 'd3')
            .attr('width', props.width)
            .attr('height', props.height);

        svg.append('g')
            .attr('class', 'd3-points');

        this.update(el, state);
    }

    // Re-compute the scales, and render the data points
    update(el, state) {
        var scales = this.scales(el, state.domain);
        this._drawPoints(el, scales, state.data);
    }

    remove(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
    }


    _drawPoints(el, scales, data) {
        var g = rd3.select(el).selectAll('.d3-points');

        var point = g.selectAll('.d3-point')
        .data(data, function(d) { return d.id; });

        // ENTER
        point.enter().append('circle')
           .attr('class', 'd3-point');

        // ENTER & UPDATE
        point.attr('cx', function(d) { return scales.x(d.x); })
            .attr('cy', function(d) { return scales.y(d.y); })
           .attr('r', function(d) { return scales.z(d.z); });

        // EXIT
        point.exit()
            .remove();
        }
        */

}

export default Chart;
