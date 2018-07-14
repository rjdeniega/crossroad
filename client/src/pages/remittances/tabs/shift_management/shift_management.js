/**
 * Created by JasonDeniega on 05/07/2018.
 */
import React, { Component } from 'react';
import './style.css'
import emptyStateImage from '../../../../images/empty_state_construction.png'
import { Button, notification } from 'antd';
import { clockO } from 'react-icons-kit/fa/clockO'
import { Icon } from 'react-icons-kit'
import { DatePicker } from 'antd';
import moment from 'moment';
import { Table, Avatar, Dropdown, Menu, message } from 'antd';
import { Icon as AntIcon } from 'antd';
import { getData, postData } from "../../../../network_requests/general";


const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
//this defines the struvcture of the table and how its rendered, in this case I just have one column
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    render: (text,record) => <div><Avatar className="driver-icon" style={{ backgroundColor: '#4d9dd0', marginRight: '20px' }} src={record.photo? record.photo:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>
        {record.name}</div>
}];

export class ShiftManagementPane extends Component {
    state = {
        startDateObject: null,
        activeShift: null,
        startDate: null,
        endDate: null,
        endDateObject: null,
        am_shift_drivers: null,
        pm_shift_drivers: null,
        mn_shift_drivers: null,
        am_shift_supervisor: "select AM supervisor",
        am_shift_supervisor_key: null,
        pm_shift_supervisor: "select PM supervisor",
        pm_shift_supervisor_key: null,
        mn_shift_supervisor: "select Midnight supervisor",
        mn_shift_supervisor_key: null,
        supervisors: null
    };

    componentDidMount() {
        if (this.state.activeShift === null) {
            this.openNotification()
        }
        this.fetchDrivers();
        this.fetchSupervisors();

    }

    fetchDrivers() {
        return getData('/members/drivers').then(data => {
            if (!data["error"]) {
                //for each entry in drivers data, append data as a dictionary in tableData
                //ant tables accept values {"key": value, "column_name" : "value" } format
                //I cant just pass the raw array since its a collection of objects
                const tableData = [];
                //append drivers with their ids as key
                console.log(data);
                data["drivers"].forEach(item => tableData.push({
                    "key": item.id,
                    "name": item.name,
                    "photo": item.photo
                }));
                this.setState({ drivers: tableData });
            }
            else {
                console.log(data["error"]);
            }
        });
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
    }

    // rowSelection object indicates the need for row selection
    amRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                am_shift_drivers: selectedRowKeys
            }, () => {
                console.log(this.state.am_shift_drivers);
            })
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    pmRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                pm_shift_drivers: selectedRowKeys
            }, () => {
                console.log(this.state.pm_shift_drivers);
            })
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    mnRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                mn_shift_drivers: selectedRowKeys
            }, () => {
                console.log(this.state.mn_shift_drivers);
            })
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };

    //normal action handlers
    close = () => {
        console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
    };
    openNotification = () => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                Confirm
            </Button>
        );
        notification.open({
            message: 'Please set shift',
            description: 'No shifts have been set for the next 15 days.',
            btn,
            key,
            onClose: this.close,
        });
    };
    //component change handlers
    handleDateChange = (date, dateString) => {
        const endDateString = moment(date).add(15, 'days').format('YYYY-MM-DD');
        const endDateObject = moment(date).add(15, 'days');
        const startDateString = moment(date).format('YYYY-MM-DD');

        this.setState({
            startDate: startDateString,
            startDateObject: moment(date),
            endDate: endDateString,
            endDateObject: endDateObject
        }, () => {
            console.log(this.state.startDate, this.state.endDate)
        });

    };
    handleSupervisorSelect = type => event => {
        //.children gives name
        //.eventKey gives PK
        console.log(event.item.props.eventKey);
        if (type === "AM") {
            this.setState({
                am_shift_supervisor: event.item.props.children,
                am_shift_supervisor_key: event.item.props.eventKey
            }, () => console.log("am" + this.state.am_shift_supervisor))
        }
        else if (type === "PM") {
            this.setState({
                pm_shift_supervisor: event.item.props.children,
                pm_shift_supervisor_key: event.item.props.eventKey
            }, () => console.log("pm" + this.state.pm_shift_supervisor))
        }
        else {
            this.setState({
                mn_shift_supervisor: event.item.props.children,
                mn_shift_supervisor_key: event.item.props.eventKey
            }, () => console.log("midnight" + this.state.mn_shift_supervisor))
        }
    };
    transformToDict = array => {
        const array_dict = [];
        array.map(item => {
            array_dict.push({
                "driver": item
            })
        });
        return array_dict
    };
    createForm = () => {
        const am_shift = {
            "supervisor": this.state.am_shift_supervisor_key,
            "type": "A",
            "drivers_assigned": this.transformToDict(this.state.am_shift_drivers)
        };
        const pm_shift = {
            "supervisor": this.state.pm_shift_supervisor_key,
            "type": "P",
            "drivers_assigned": this.transformToDict(this.state.pm_shift_drivers)
        };
        const mn_shift = {
            "supervisor": this.state.mn_shift_supervisor_key,
            "type": "M",
            "drivers_assigned": this.transformToDict(this.state.mn_shift_drivers)
        };
        return {
            "start_date": this.state.startDate,
            "end_date": this.state.endDate,
            "shifts": [am_shift, pm_shift, mn_shift],
        };
    };
    handleShiftCreate = () => {
        const data = this.createForm();
        console.log(JSON.stringify(data));
        postData('remittances/schedules/', data)
            .then((data) => {
                console.log(data["error"]);
                if (data['errors']) {
                    console.log(data);
                    message.error(data['errors']['non_field_errors'])
                }
                else {
                    console.log(data['start_date']);
                    message.success("Shift creation successful for " + data['start_date'] + "to" + data['end_date']);
                }
            })
            .catch(error => console.log(error));
    };

    renderSupervisors = () => this.state.supervisors.map(supervisor =>
        <Menu.Item key={supervisor.id}>{supervisor.name}</Menu.Item>
    );
    supervisors = (type) => (
        <Menu onClick={this.handleSupervisorSelect(type)}>
            {/*append only when its fetched*/}
            {this.state.supervisors && this.renderSupervisors()}
        </Menu>
    );
//JSX rendering functions
    renderShiftTables = () => (
        <div className="tables-wrapper">
            <div className="am-shift-pane">
                <div className="shifts-label-div">
                    <div className="tab-label">AM</div>
                    <Dropdown overlay={this.supervisors("AM")}>
                        <Button className="supervisor-select" style={{ marginLeft: 8 }}>
                            {this.state.am_shift_supervisor} <AntIcon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
                <Table rowSelection={this.amRowSelection} pagination={false} columns={columns}
                       dataSource={this.state.drivers}/>,
            </div>
            <div className="pm-shift-pane">
                <div className="shifts-label-div">
                    <div className="tab-label">PM</div>
                    <Dropdown overlay={this.supervisors("PM")}>
                        <Button className="supervisor-select" style={{ marginLeft: 8 }}>
                            {this.state.pm_shift_supervisor}<AntIcon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
                <Table rowSelection={this.pmRowSelection} pagination={false} columns={columns}
                       dataSource={this.state.drivers}/>,

            </div>
            <div className="mn-shift-pane">
                <div className="shifts-label-div">
                    <div className="tab-label">Midnight</div>
                    <Dropdown overlay={this.supervisors("MN")}>
                        <Button className="supervisor-select" style={{ marginLeft: 8 }}>
                            {this.state.mn_shift_supervisor}<AntIcon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
                <Table rowSelection={this.mnRowSelection} pagination={false} columns={columns}
                       dataSource={this.state.drivers}/>,
            </div>
        </div>
    );

    render() {
        return (
            <div className="om-tab-body">
                <div className="content-body">
                    <div className="shift-creation-body">
                        <div className="label-div">
                            <div style={{ color: 'var(--darkgreen)' }}>
                                <Icon icon={clockO} size={30} style={{ marginRight: '10px', marginTop: '5px' }}/>
                            </div>
                            <div className="tab-label">
                                Create Shift
                            </div>
                        </div>
                        <div className="expiration-label">expiring in 7 days</div>

                        <div className="date-grid">
                            <DatePicker
                                className="date-picker"
                                format="YYYY-MM-DD"
                                value={this.state.startDateObject}
                                placeholder="Start Date"
                                onChange={() => this.handleDateChange()}
                            />
                            <DatePicker
                                className="date-picker"
                                disabled
                                placeholder="End Date"
                                format="YYYY-MM-DD"
                                value={this.state.endDateObject}
                            />
                        </div>
                        <div className="create-shift-button">
                            <Button type="primary" onClick={this.handleShiftCreate}>Create this shift</Button>
                        </div>
                    </div>
                    <div className="driver-selection">
                        {/*<div className="table-label-div">*/}
                        {/*<div className="tab-label">*/}
                        {/*Select Drivers*/}
                        {/*</div>*/}
                        {/*<div className="guideline">*/}
                        {/*Select N drivers for each shift*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {this.renderShiftTables()}
                    </div>
                </div>
            </div>
        )
    }
}
