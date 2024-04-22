import React, { useState } from 'react';

import './CalendarOptions.css'

export default class CalendarOptions extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <>
                <label>
                    <select className="selectStyle" onChange={this.roomSelect} defaultValue="0">
                        <option value="0">201</option>
                        <option value="1">202</option>
                        <option value="1">203</option>
                    </select>
                    {/* <select className="selectStyle" onChange={this.bedSelect} defaultValue="1">
                        <option value="0">gulta</option>
                        <option value="1">lielā gulta</option>
                    </select> */}
                </label>
                <label>
                    <select className="selectStyle" onChange={this.unavailabilityButton} defaultValue="add">
                        <option value="add">Pievienot pierakstu</option>
                        <option value="unavailablity">Nepieejamo datumu pievienošana</option>
                    </select>
                    <button className="buttonStyle" onClick={this.excelButton}>Lejupielādēt Excel</button>
                </label>
            </>
        );
    }

    roomSelect (event) {

    }
    bedSelect (event) {

    }
    excelButton () {
        console.log("excelButton");
        // console.log(this.props.events);

        // exportExcel(this.state.month, this.state.year, this.props.events);
    }
    unavailabilityButton (event) {
        // this.state.eventMode = event.target.value;
    }
}