/**
 * Created by JasonDeniega on 16/11/2018.
 */
/**
 * Created by JasonDeniega on 16/11/2018.
 */
/**
 * Created by JasonDeniega on 13/11/2018.
 */


import React, { Component, Fragment } from 'react'
import '../../../../utilities/colorsFonts.css'
import './style.css'
import { Button } from 'antd'
import { Icon as AntIcon, Input, Card, Table, DatePicker, Select, Menu, Dropdown } from 'antd'
import { getData, postData } from '../../../../network_requests/general'
import { Icon } from 'react-icons-kit'
import { fileTextO } from 'react-icons-kit/fa/fileTextO'
import { money } from 'react-icons-kit/fa/money'
import moment from "moment";
import ReactToPrint from "react-to-print";


const dateFormat = "YYYY-MM-DD";
const { TextArea } = Input;

const Option = Select.Option;

class ComponentToPrint extends React.Component {


    render() {
        const { data } = this.props;
        return (
            <div className="formatted-container">
                <div className="report-labels">
                    {this.props.data &&
                    <Fragment>
                        {this.props.data.start_date &&
                        <p><b> {this.props.data.supervisor_name}'s weekly report for {this.props.data.start_date} to {this.props.data.end_date}</b> </p>
                        }
                    </Fragment>
                    }
                </div>
                <div className="formatted-report-body">
                    {this.props.data &&
                    <Fragment>
                        <table cellSpacing="50" cellPadding="3px">
                            <thead>
                            <th>Day</th>
                            <th>Date</th>
                            <th>Shift</th>
                            <th>No.of Driver</th>
                            <th>Daily Remittance</th>
                            <th>Deployed Driver/s</th>
                            <th>Absent Driver/s</th>
                            <th>Remarks</th>
                            </thead>
                            <tbody>
                            {this.props.data &&
                            <Fragment>
                                {this.props.data.rows.map(item => (
                                    <tr>
                                        <td>{item.day}</td>
                                        <td>{item.date}</td>
                                        <td>{item.shift}</td>
                                        <td>{item.number_of_drivers}</td>
                                        <td>{item.daily_remittance}</td>
                                        <td>
                                            {item.deployed_drivers.map(item => (
                                                <p>{item.driver_name}</p>
                                            ))}
                                        </td>
                                        <td>
                                            {item.absent_drivers.map(item => (
                                                <p>{item.driver_name}</p>
                                            ))}
                                        </td>
                                        <td>
                                            {item.remarks}
                                        </td>
                                    </tr>
                                ))}
                            </Fragment>
                            }
                            </tbody>
                        </table>
                    </Fragment>
                    }
                    <p className="end-label">END OF REPORT</p>
                </div>
            </div>
        );
    }
}
export class WeeklySupervisorReport extends Component {
    state = {};

    componentDidMount() {
        this.fetchSupervisors()
    }

    fetchSupervisors() {
        console.log("entered here");
        return fetch('/members/supervisors').then(response => response.json()).then(data => {
            if (!data["error"]) {
                //Were not appending it to a table so no necessary adjustments needed
                this.setState({ supervisors: data["supervisors"] },
                    () => console.log(this.state.supervisors));
            }
            else {
                console.log(data["error"]);
            }
        }, console.log(this.state.supervisors));
    };

    fetchTransactions() {
        let data = {
            "start_date": this.state.start_date,
            "end_date": this.state.end_date,
            "supervisor_id": this.state.supervisor_id
        };
        postData('supervisor_weekly_report/', data).then(data => {
            console.log(data);
            if (!data.error) {
                this.setState({
                    data: data
                })
            }
        });
    }

    handleStartDateChange = (date, dateString) => {
        this.setState({
            start_date_object: date,
            start_date: dateString
        }, () => this.fetchTransactions())
    };
    handleEndDateChange = (date, dateString) => {
        this.setState({
            end_date_object: date,
            end_date: dateString
        }, () => this.fetchTransactions())
    };
    renderSupervisors = () => this.state.supervisors.map(supervisor =>
        <Menu.Item key={supervisor.id}>{supervisor.name}</Menu.Item>
    );
    handleSupervisorSelect = event => {
        //.children gives name
        //.eventKey gives PK
        console.log(event.item.props.eventKey);
        this.setState({
            supervisor: event.item.props.children,
            supervisor_id: event.item.props.eventKey
        })

    };
    supervisors = () => (
        <Menu onClick={this.handleSupervisorSelect}>
            {/*append only when its fetched*/}
            {this.state.supervisors && this.renderSupervisors()}
        </Menu>
    );

    render() {
        return (
            <div className="report-body">
                <Dropdown overlay={this.supervisors()}>
                    <Button style={{ marginLeft: 8 }}>
                        {this.state.supervisor}<AntIcon type="down"/>
                    </Button>
                </Dropdown>
                <DatePicker placeholder="date from" onChange={this.handleStartDateChange} format={dateFormat}/>
                <div className="formatted-report-modal-container">
                    <ReactToPrint
                        trigger={() => <a href="#">Print this out!</a>}
                        content={() => this.componentRef}
                    />
                    <ComponentToPrint data={this.state.data} ref={el => (this.componentRef = el)}/>
                </div>
            </div>
        );
    }
}