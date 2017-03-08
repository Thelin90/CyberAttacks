import React, { Component } from 'react';

class Data extends Component {
    render() {
        return (
            <div className="Data">
                <div>Some test again</div>
                <button className="geneBtn">generate something</button>
                <h1>{this.props.domain}</h1>
            </div>
        );
    }
}
export default Data;