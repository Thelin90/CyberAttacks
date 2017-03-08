import React, { Component } from 'react';

class Data extends Component {

    /*
     * Fetch data with plain JS
     */
    fetchData() {
        var dataTest = [];
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
                    dataTest = data;
                    console.log(dataTest);
                    console.log(dataTest[4].DateTime);
                });
            }
        ).catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    }
    render() {
        return (
            <div className="Data">
            </div>
        );
    }
}
export default Data;