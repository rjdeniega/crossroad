/**
 * Created by JasonDeniega on 02/07/2018.
 */

import React, { Component, Fragment } from 'react';
import './style.css'
import emptyStateImage from '../../../../images/empty_state_construction.png'
import {
    Modal,
    Button,
    Input,
    Select,
    Icon,
    Table,
    Radio,
    Row,
    Col,
    Alert,
    Form,
    DatePicker,
    Pagination,
} from 'antd'
import { postDataWithImage, postDataWithFile, getData, postData } from "../../../../network_requests/general";
import moment from "moment";

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const columns = [{
    title: 'Date',
    dataIndex: 'shift.date',
    key: 'shift_date',
    render: (text) => (
        <div>
            {text}
        </div>
    )
}, {
    title: 'Shift Type',
    dataIndex: 'shift.type',
    key: 'shift_type',
    render: (text) => (
        <div className="rem-status">
            {text == "A" &&
            <div className="shift-table-column"><Icon type="check-circle" className="status-icon"/> <p>AM</p></div>}
            {text == "P" &&
            <div className="shift-table-column"><Icon type="check-circle" className="status-icon"/> <p>PM</p></div>}
            {text == "MN" &&
            <div className="shift-table-column"><Icon type="check-circle" className="status-icon"/> <p>MN</p></div>}
        </div>
    ),
}, {
    title: 'Total Remittances',
    dataIndex: 'total',
    key: 'grand_total',
    render: (text, record) => (
        <div className="rem-status">
            <p><b>Php {text}</b></p>
        </div>
    ),
}, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
        <Button className="view-button" type="ghost" icon="eye">
            View Details
        </Button>
    ),
}];
const transaction_columns = [{
    title: 'Card Number',
    dataIndex: 'card_number',
    key: 'card_number',
    render: (text) => (
        <div>
            {text}
        </div>
    )
}, {
    title: 'Member Name',
    dataIndex: 'member.name',
    key: 'member.name',
    render: (text, record) => (
        <div>
            {!text && <p>Prospect</p>}
            {text}
        </div>
    )
}, {
    title: 'Total Remittances',
    dataIndex: 'total',
    key: 'grand_total',
    render: (text, record) => (
        <p><b>Php {parseInt(text)}</b></p>
    ),
}];
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const dateFormat = "YYYY-MM-DD";
export class BeepPane extends Component {
    state = {
        visible: false,
        report_visible: false,
        file: null,
        shift_type: null,
        shifts: [],
        transactions: [],
        function: 'add',
        date: null,
        date_object: moment('2015/01/01', dateFormat),
        is_manual: false,
    };

    componentDidMount() {
        this.fetchTransactions();
    }

    fetchTransactions = () => {
        let data = {
            "start_date": this.state.start_date,
            "end_date": this.state.end_date
        };
        postData('/remittances/beep_modified/', data).then(data => {
            if (!data.error) {
                console.log(data.beep_shifts);
                this.setState({
                    shifts: data.beep_shifts
                })
            }
            else {
                console.log(data);
            }
        }).catch(error => console.log(error))
    };
    showModal = item => event => {
        console.log(item);
        console.log(event);
        this.setState({
            visible: true
        })
    };
    handleDateChange = (date, dateString) => this.setState({
        date_object: date,
        date: dateString
    });
    handleConfirm = (e) => {
        this.handleUpload();
        this.setState({
            visible: false,
            file: null,
            shift_type: null,
        });
    };
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
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    fetchTransactionData = data => {
        console.log("entered here");
        getData('/remittances/specific_beep/' + data.id).then(data => {
            if (!data.error) {
                console.log(data.transactions);
                this.setState({
                    transactions: data.transactions
                })
            }
            else {
                console.log(data);
            }
        }).catch(error => console.log(error));
        this.setState({
            report_visible: true,
        });
    };
    handleReportConfirm = (e) => {
        this.setState({
            report_visible: false,
        });
    };
    handleReportCancel = (e) => {
        this.setState({
            report_visible: false,
        });
    };
    handleFileChange = (e) => {
        this.setState({
            file: e.target.files[0]
        });
        console.log(e.target.files[0])
    };
    handleSelectChange = fieldName => value => {
        // this function is to handle drop-downs
        const state = { ...this.state };
        state[fieldName] = value;
        this.setState({
            ...state
        });
    };
    handleUpload = () => {
        const formData = new FormData();
        formData.append('shift_type', this.state.shift_type);
        formData.append('function', this.state.function);
        formData.append('date', this.state.date);
        formData.append('file', this.state.file);
        console.log(formData);

        postDataWithFile('/remittances/beep/', formData)
            .then(data => {
                if (data.error) {
                    console.log("theres an error");
                    this.setState({
                        error: data["error"],
                    });
                    console.log(this.state.error);
                }
                else {
                    console.log(data);
                    console.log(data.user_staff);
                }
            })
            .catch(error => console.log(error));
    };

    onChange = (e) => {
        this.setState({
            function: e.target.value
        })
        console.log(`radio checked:${e.target.value}`);
    }
    onChangeManual = (e) => {
        this.setState({
            is_manual: e.target.value
        })
        console.log(`radio checked:${e.target.value}`);
    }


    render() {
        return (
            <div className="beep-tab-body">
                <Modal
                    title="Add Beep CSV"
                    visible={this.state.visible}
                    onOk={this.handleConfirm}
                    onCancel={this.handleCancel}
                >
                    <Form className="login-form">
                        {this.state.function == "replace" &&
                        <Alert message="Warning! This will replace all existing information on this shift"
                               type="warning" showIcon/>
                        }

                        <Form.Item
                            {...formItemLayout}
                            label="Choose Action:"
                        >
                            <RadioGroup onChange={this.onChange} defaultValue="add">
                                <RadioButton value="add">Add</RadioButton>
                                <RadioButton value="replace">Replace</RadioButton>
                            </RadioGroup>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Shift:"
                        >
                            <RadioGroup onChange={this.onChangeManual} defaultValue={false}>
                                <RadioButton value={false}>Now</RadioButton>
                                <RadioButton value={true}>Select Manually</RadioButton>
                            </RadioGroup>
                        </Form.Item>
                        {this.state.is_manual &&
                        <Fragment>
                            <Form.Item
                                {...formItemLayout}
                                label="Select Date"
                            >
                                <DatePicker className="user-input" onChange={this.handleDateChange}
                                            format={dateFormat}/>
                            </Form.Item>

                            <Form.Item
                                {...formItemLayout}
                                label="Shift Type"
                            >
                                <Select onChange={this.handleSelectChange("shift_type")} className="user-input"
                                        defaultValue="Please select shift type">
                                    <Option value="A">AM</Option>
                                    <Option value="P">PM</Option>
                                </Select>
                            </Form.Item>
                        </Fragment>
                        }
                        <Form.Item
                            {...formItemLayout}
                            label="Beep CSV file"
                        >
                            <Input className="user-input upload-input" type="file" placeholder="select image"
                                   onChange={this.handleFileChange}/>
                        </Form.Item>
                    </Form>


                    {/*<Button type="primary" onClick={this.handleUpload}> Submit </Button>*/}
                </Modal>
                <Modal
                    className="transaction-modal"
                    title="Beep Shift Transactions"
                    visible={this.state.report_visible}
                    onOk={this.handleReportConfirm}
                    onCancel={this.handleReportCancel}
                >
                    <Table bordered size="medium"
                           className="remittance-table"
                           columns={transaction_columns}
                           dataSource={this.state.transactions}
                    />
                </Modal>
                <Form className="date-form">
                    <Form.Item
                            style={{ 'margin-right': '10px' }}
                            label="Filter Dates"
                        >
                            <DatePicker className="user-input" placeholder="Filter Start Date"
                                        onChange={this.handleStartDateChange}
                                        format={dateFormat}/>
                            <DatePicker className="user-input" placeholder="Filter End Date"
                                        onChange={this.handleEndDateChange}
                                        format={dateFormat}/>
                        </Form.Item>
                        <Form.Item
                            label="Beep Upload"
                        >
                            <Button type="primary" className="upload-button" onClick={this.showModal()}>Upload
                                CSV</Button>
                        </Form.Item>
                </Form>
                <div className="table-div">
                    <Table bordered size="medium"
                           className="remittance-table"
                           columns={columns}
                           dataSource={this.state.shifts}
                           pagination={{
                               pageSize: 4,
                           }}
                           onRow={(record) => {
                               return {
                                   onClick: () => {
                                       this.fetchTransactionData(record.shift);
                                   },       // click row
                               };
                           }}
                    />
                </div>
            </div>
        );
    }
}