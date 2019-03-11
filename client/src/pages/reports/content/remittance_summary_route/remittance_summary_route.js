/**
 * Created by JasonDeniega on 11/03/2019.
 */
/**
 * Created by JasonDeniega on 08/11/2018.
 */
/**
 * Created by JasonDeniega on 29/07/2018.
 */

import React, { Component, Fragment } from 'react'
import '../../../../utilities/colorsFonts.css'
import './style.css'
import { Button } from 'antd'
import { Icon as AntIcon, Input, Card, Table, DatePicker, Select } from 'antd'
import { getData, postData } from '../../../../network_requests/general'
import { Icon } from 'react-icons-kit'
import { fileTextO } from 'react-icons-kit/fa/fileTextO'
import { money } from 'react-icons-kit/fa/money'
import moment from "moment";
import ReactToPrint from "react-to-print";


const dateFormat = "YYYY-MM-DD";
const Option = Select.Option;

class ComponentToPrint extends React.Component {
    render() {
        const { data } = this.props;
        return (
            <div className="container">
                <div className="report-labels">
                    {this.props.data &&
                    <Fragment>
                        {this.props.data.end_date &&
                        <p> Remittance Per Route Report for {this.props.data.start_date} to {this.props.data.end_date} </p>
                        }
                    </Fragment>
                    }
                </div>
                <div className="report-body">
                    <table cellSpacing="50" cellPadding="3px">
                        <thead>
                        <th>Date</th>
                        <th>Route</th>
                        <th>Shift</th>
                        <th>Actual Remittances</th>
                        <th>Total Per Day</th>
                        <th>Fuel</th>
                        <th>Total after Fuel</th>
                        <th>Beep Remittance</th>
                        <th>Total</th>
                        </thead>
                        <tbody>
                        {this.props.data && this.props.data.rows.map(item => (
                            <Fragment>
                                <tr>
                                    <td>
                                        <b>{item.date}</b>
                                    </td>
                                </tr>
                                {item.routes.map(item => (
                                    <Fragment>
                                        <tr>
                                            <td></td>
                                            <td>{item.route}</td>
                                        </tr>
                                        {item.shifts.map(item => (
                                            <Fragment>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{item.type}</td>
                                                    <td>{item.remittance}</td>
                                                    {(item.type == "A" || item.type == "AM") &&
                                                    <td></td>
                                                    }
                                                    {(item.type == "P" || item.type == "PM") &&
                                                    <td><b>{item.total_per_day}</b></td>
                                                    }
                                                    <td>{item.fuel}</td>
                                                    <td><b>{item.remittance_minus_fuel}</b></td>
                                                    <td>{item.beep_total}</td>
                                                    <td>{item.beep_ticket_total}</td>
                                                </tr>
                                            </Fragment>
                                        ))}
                                    </Fragment>
                                ))}
                                <tr>
                                    <td></td>
                                    <td className="total-line"><b> Main Road Total </b></td>
                                    <td className="total-line"></td>
                                    <td className="total-line"></td>
                                    <td className="total-line"></td>
                                    <td className="total-line"></td>
                                    <td className="total-line"></td>
                                    <td className="total-line"></td>
                                    <td className="total-line"><b>{item.mr_route_total}</b></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><b> Kaliwa Total </b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{item.l_route_total}</b></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><b> Kanan Total </b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{item.r_route_total}</b></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><b> Day Total </b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><b>{item.grand_route_total}</b></td>
                                </tr>
                            </Fragment>
                        ))}
                        {this.props.data &&
                        <Fragment>
                            <tr>
                                <td></td>
                                <td className="total-line"><b> Main Road Grand Total </b></td>
                                <td className="total-line"></td>
                                <td className="total-line"></td>
                                <td className="total-line"></td>
                                <td className="total-line"></td>
                                <td className="total-line"></td>
                                <td className="total-line"></td>
                                <td className="total-line"><b>{this.props.data.mr_grand_remit_total}</b></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><b> Kaliwa Grand Total </b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>{this.props.data.l_grand_remit_total}</b></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><b> Kanan Grand Total </b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>{this.props.data.r_grand_remit_total}</b></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><b> Grand Total </b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>{this.props.data.grand_route_total}</b></td>
                            </tr>
                        </Fragment>
                        }
                        </tbody>
                    </table>
                    <p className="end-label">END OF REPORT</p>
                </div>
            </div>
        );
    }
}
export class RemittanceSummaryRoute extends Component {
    state = {};

    componentDidMount() {
    }

    fetchTransactions() {
        let data = {
            "start_date": this.state.start_date,
            "end_date": this.state.end_date,
        };
        postData('/beep_tickets_per_route/', data).then(data => {
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


    render() {
        return (
            <div className="report-body">
                <DatePicker placeholder="date from" onChange={this.handleStartDateChange} format={dateFormat}/>
                <DatePicker placeholder="date to" onChange={this.handleEndDateChange} format={dateFormat}/>
                <div className="report-modal-container">
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