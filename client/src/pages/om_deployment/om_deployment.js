/**
 * Created by JasonDeniega on 07/03/2019.
 */
import React, { Component } from 'react';
import { Header } from '../remittances/components/header/remittance_header.js';
import { Row, Col, Tag, Drawer, Button, List, Divider, Form, Input, Tooltip, Icon, message } from 'antd';

import './revised-style.css'
import { list } from 'react-icons-kit/feather';
import { postData } from '../../network_requests/general';

export class OMDeployment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="body-wrapper">
                <div className="remittance-page-wrapper">
                    <div className="page-container">
                        <Header />
                        <Row className="remittance-body">
                            <Col span={24}>
                                <DeploymentList />
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

class DeploymentList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'deployments': [],
            'drawer_visibility': false
        }
    }

    showDrawer() {
        this.setState({
            drawer_visibility: true,
        })
    }

    onClose() {
        this.setState({
            drawer_visibility: false
        })
    }

    componentDidMount() {
        this.fetchDeployments();
    }

    fetchDeployments() {
        let driver = null;
        console.log(this.props.driver);
        if (this.props.driver == undefined || this.props.driver == null) {
            driver = JSON.parse(localStorage.user_staff);
        }
        else {
            driver = this.props.driver
        }
        fetch('/remittances/deployments/driver/' + driver.id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    this.setState({
                        deployments: data.deployments
                    });
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    render() {


        return (
            <div className="list-container">
                <List
                    header={<div> List of Deployments </div>}
                    dataSource={this.state.deployments}
                    bordered={true}
                    renderItem={
                        item => (
                            <div className="list-detail-container">
                                <List.Item>
                                    <DeploymentListDetails
                                        id={item.id}
                                        date={item.shift_date}
                                        start_time={item.start_time}
                                        end_time={item.end_time}
                                        status={item.status}
                                        shuttle={item.shuttle}
                                    />
                                </List.Item>
                            </div>
                        )
                    }
                />
            </div>
        );
    }
}

export function DeploymentListDetails(props) {
    let tag_color = props.status == 'O' ? 'blue' : 'green';
    let status = props.status == 'O' ? 'Ongoing' : 'Finished';
    let end_time = props.end_time == null ? 'N/A' : props.end_time;
    console.log(props.driver_object);
    if (status == 'Ongoing') {
        return (
            <div className="deployment-list-container">
                <div className="list-header">
                    <span className="list-header-date">
                        {props.driver_object ? props.driver_object.name : props.date}
                    </span>
                    <Tag color={tag_color}>
                        {status}
                    </Tag>
                </div>
                <div className="list-details">
                    <DetailItem
                        title="Shuttle"
                        value={props.shuttle}
                    />

                    <DetailItem
                        title="Start Time"
                        value={props.start_time}
                    />
                    <DetailItem
                        title="End Time"
                        value={end_time}
                    />
                </div>
                <SubmitRemittance
                    deployment_id={props.id}
                />
            </div>
        );
    }
    else {
        return (
            <div className="deployment-list-container">
                <div className="list-header">
                    <span className="list-header-date">
                        {props.driver_object ? props.driver_object.name : props.date}
                    </span>
                    <Tag color={tag_color}>
                        {status}
                    </Tag>
                </div>
                <div className="list-details">
                    <DetailItem
                        title="Shuttle"
                        value={props.shuttle}
                    />
                    <DetailItem
                        title="Start Time"
                        value={props.start_time}
                    />
                    <DetailItem
                        title="End Time"
                        value={end_time}
                    />
                </div>
                <ViewRemittance
                    deployment_id={props.id}
                    deployment_date={props.date}
                />
            </div>
        );
    }

}

class ViewRemittance extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            drawer_visibility: false,
        }

        this.onClose = this.onClose.bind(this);
    }

    showDrawer = () => {
        this.setState({
            drawer_visibility: true
        })
    }

    onClose = () => {
        this.setState({
            drawer_visibility: false
        })
    }

    render() {
        return (
            <div className="button-container">
                <Button
                    className="list-action"
                    onClick={this.showDrawer}
                >
                    View Remittance
                </Button>
                <Drawer
                    title={"Remittance Info for deployment on " + this.props.deployment_date}
                    placement="right"
                    closable={true}
                    onClose={this.onClose}
                    visible={this.state.drawer_visibility}
                    width={600}
                >
                    <RemittanceInfo
                        deployment_id={this.props.deployment_id}
                    />
                </Drawer>
            </div>
        )
    }
}

class RemittanceInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "remittance_form": {},
            "ten_tickets": [],
            "twelve_tickets": [],
            "fifteen_tickets": []
        }
    }

    componentDidMount() {
        this.fetchRemittanceForm();
    }

    fetchRemittanceForm() {
        console.log(this.props.deployment_id)
        fetch('/remittances/remittance_form/view/' + this.props.deployment_id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    this.setState({
                        remittance_form: data.remittance_form,
                        ten_tickets: data.ten_tickets,
                        twelve_tickets: data.twelve_tickets,
                        fifteen_tickets: data.fifteen_tickets
                    });
                    console.log(
                        this.state.remittance_form,
                        this.state.ten_tickets,
                        this.state.twelve_tickets,
                        this.state.fifteen_tickets
                    )
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    render() {

        const ten_isEmpty = this.state.ten_tickets.length == 0 ? true : false;
        const twelve_isEmpty = this.state.twelve_tickets.length == 0 ? true : false;
        const fifteen_isEmpty = this.state.fifteen_tickets.length == 0 ? true : false;

        return (
            <div>
                <Row gutter={16}>
                    <Col span={8}>
                        <span className="view-remittances-tag">
                            Mileage:
                        </span>
                    </Col>
                    <Col span={16}>
                        <span>
                            {parseFloat(Math.round(this.state.remittance_form.km_from * 100) / 100).toFixed(2)} km
                        </span>
                        <span> - </span>
                        <span>
                            {parseFloat(Math.round(this.state.remittance_form.km_to * 100) / 100).toFixed(2)} km
                        </span>
                    </Col>
                </Row>
                {ten_isEmpty == false &&
                <Divider>
                    10 Peso Tickets
                </Divider>
                }
                {ten_isEmpty == false &&
                this.state.ten_tickets.map((item) => (
                    <Row gutter={16}>
                        <Col span={8}>
                                <span className="view-remittances-tag">
                                    Ticket No:
                            </span>
                        </Col>
                        <Col span={8}>
                                <span>
                                    {item.start_ticket}
                                </span>
                            <span> - </span>
                            <span>
                                    {item.end_ticket}
                                </span>
                        </Col>
                        <Col span={8}>
                            <Divider type="vertical"/>
                            <Tooltip
                                title={"number of tickets (" + String(item.end_ticket - item.start_ticket) + " pcs) * 10"}
                                placement="topRight"
                            >
                                    <span className="item-total">
                                        {parseFloat(Math.round(item.total * 100) / 100).toFixed(2)}
                                    </span>
                            </Tooltip>
                        </Col>
                    </Row>
                ))
                }

                {twelve_isEmpty == false &&
                <Divider>
                    12 Peso Tickets
                </Divider>
                }
                {twelve_isEmpty == false &&
                this.state.twelve_tickets.map((item) => (
                    <Row gutter={16}>
                        <Col span={8}>
                                <span className="view-remittances-tag">
                                    Ticket No:
                            </span>
                        </Col>
                        <Col span={8}>
                                <span>
                                    {item.start_ticket}
                                </span>
                            <span> - </span>
                            <span>
                                    {item.end_ticket}
                                </span>
                        </Col>
                        <Col span={8}>
                            <Divider type="vertical"/>
                            <Tooltip
                                title={"number of tickets (" + String(item.end_ticket - item.start_ticket) + " pcs) * 12"}
                                placement="topRight"
                            >
                                    <span className="item-total">
                                        {parseFloat(Math.round(item.total * 100) / 100).toFixed(2)}
                                    </span>
                            </Tooltip>
                        </Col>
                    </Row>
                ))
                }

                {fifteen_isEmpty == false &&
                <Divider>
                    15 Peso Tickets
                </Divider>
                }
                {fifteen_isEmpty == false &&
                this.state.fifteen_tickets.map((item) => (
                    <Row gutter={16}>
                        <Col span={8}>
                                <span className="view-remittances-tag">
                                    Ticket No:
                                </span>
                        </Col>
                        <Col span={8}>
                                <span>
                                    {item.start_ticket}
                                </span>
                            <span> - </span>
                            <span>
                                    {item.end_ticket}
                                </span>
                        </Col>
                        <Col span={8}>
                            <Divider type="vertical"/>
                            <Tooltip
                                title={"number of tickets (" + String(item.end_ticket - item.start_ticket) + " pcs) * 15"}
                                placement="topRight"
                            >
                                    <span className="item-total">
                                        {parseFloat(Math.round(item.total * 100) / 100).toFixed(2)}
                                    </span>
                            </Tooltip>
                        </Col>
                    </Row>
                ))
                }

                <Divider orientation="left">Other Information</Divider>
                <Row gutter={16}>
                    <Col span={16}>
                        {this.state.remittance_form.fuel_cost != 0 ? (
                                <Tooltip title={"Receipt No.: " + this.state.remittance_form.fuel_receipt}>
                                <span className="view-remittances-tag">
                                    Fuel Costs:
                                </span>
                                </Tooltip>
                            ) : (
                                <span className="view-remittances-tag">
                                Fuel Costs:
                            </span>
                            )}
                    </Col>
                    <Col span={8}>
                        <Divider type="vertical"/>
                        <span className="item-total">
                            ({parseFloat(Math.round(this.state.remittance_form.fuel_cost * 100) / 100).toFixed(2)})
                        </span>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={16}>
                        <span className="view-remittances-tag">
                            Other Costs:
                        </span>
                    </Col>
                    <Col span={8}>
                        <Divider type="vertical"/>
                        <span className="item-total">
                            ({parseFloat(Math.round(this.state.remittance_form.other_cost * 100) / 100).toFixed(2)})
                        </span>
                    </Col>
                </Row>
                <Row gutter={16} className="total-row">
                    <Col span={16}>
                        <span className="view-remittances-tag">
                            Total:
                        </span>
                    </Col>
                    <Col span={8}>
                        <Divider type="vertical"/>
                        <span className="item-rem-total">
                            (Php) {parseFloat(Math.round(this.state.remittance_form.total * 100) / 100).toFixed(2)}
                        </span>
                    </Col>
                </Row>
            </div>
        );
    }
}

class SubmitRemittance extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            drawer_visibility: false,
        }

        this.onClose = this.onClose.bind(this);
    }

    showDrawer = () => {
        this.setState({
            drawer_visibility: true
        })
    }

    onClose = () => {
        this.setState({
            drawer_visibility: false
        })
    }

    render() {

        const RemForm = Form.create({ name: 'remittance-form' })(RemittanceForm);

        return (
            <div className="button-container">
                <Button
                    className="list-action"
                    onClick={this.showDrawer}
                >
                    Submit Remittance
                </Button>
                <Drawer
                    title="Remittance Form"
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawer_visibility}
                    width={600}
                >
                    <RemForm
                        deployment_id={this.props.deployment_id}
                        onClose={this.onClose}

                    />
                </Drawer>
            </div>
        );
    }
}

function DetailItem(props) {
    return (
        <div>
            <span className="detail-item-title">{props.title}: </span>
            <span className="detail-item-value">{props.value}</span>
        </div>
    );
}

class RemittanceForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            "tenPesoTickets": [],
            "twelvePesoTickets": [],
            "fifteenPesoTickets": []
        }
    }

    componentDidMount() {
        this.fetchTickets();
    }

    handleSubmit = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var list_of_keys = Object.keys(values);

                var x = 0;
                values["ten_peso_tickets"] = [];
                while (x < list_of_keys.length) {
                    var str = list_of_keys[x]
                    if (str.includes("ten_peso")) {
                        var parts = str.split("-", 2);
                        values["ten_peso_tickets"].push({
                            "id": parts[1],
                            "value": values[list_of_keys[x]]
                        });
                    }
                    x++;
                }

                var x = 0;
                values["twelve_peso_tickets"] = [];
                while (x < list_of_keys.length) {
                    var str = list_of_keys[x]
                    if (str.includes("twelve_peso")) {
                        console.log("entered_here if twelve")
                        var parts = str.split("-", 2);
                        values["twelve_peso_tickets"].push({
                            "id": parts[1],
                            "value": values[list_of_keys[x]]
                        });
                    }
                    x++;
                }

                var x = 0;
                values["fifteen_peso_tickets"] = [];
                while (x < list_of_keys.length) {
                    var str = list_of_keys[x]
                    if (str.includes("fifteen_peso")) {
                        console.log("entered_here if fifteen")
                        var parts = str.split("-", 2);
                        values["fifteen_peso_tickets"].push({
                            "id": parts[1],
                            "value": values[list_of_keys[x]]
                        });
                    }
                    x++;
                }

                values["deployment_id"] = this.props.deployment_id

                console.log('Received values of form:', values);

                postData('remittances/remittance_form/submit/', values)
                    .then(response => {
                        if (!response.error) {
                            message.success("Remittance form has been submitted");
                        }
                        else {
                            console.log(response.error);
                        }
                    });
            }
        });
    }

    fetchTickets() {
        fetch('/remittances/tickets/' + this.props.deployment_id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    this.setState({
                        tenPesoTickets: data.ten_tickets,
                        twelvePesoTickets: data.twelve_tickets,
                        fifteenPesoTickets: data.fifteen_tickets
                    });
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        }

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        }

        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit} className="remittance-form">
                <Form.Item
                    {...formItemLayout}
                    label={
                        <span>
                            <Tooltip title="Input current mileage of the shuttle">
                                <Icon type="question-circle-o" className="field-guide"/>
                            </Tooltip>
                            Mileage
                        </span>
                    }
                >
                    {
                        getFieldDecorator('mileage', {
                            rules: [{
                                required: true,
                                message: "Please input the shuttle's current mileage"
                            },]
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
                {this.state.tenPesoTickets && this.state.tenPesoTickets.length &&
                <div>
                    <Divider>10 Peso Tickets</Divider>
                    {
                        this.state.tenPesoTickets.map((item) => (
                            <Form.Item
                                {...formItemLayout}
                                label={
                                    <span>
                                            <Tooltip title="Input the last consumed ticket of this bundle">
                                                <Icon type="question-circle-o" className="field-guide"/>
                                            </Tooltip>
                                            Ticket No. {item.start_ticket} to
                                        </span>
                                }
                                key={item.id}
                            >
                                {
                                    getFieldDecorator('ten_peso-'.concat(item.id), {
                                        rules: []
                                    })(
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        ))
                    }
                </div>
                }
                {this.state.twelvePesoTickets && this.state.twelvePesoTickets.length &&
                <div>
                    <Divider>12 Peso Tickets</Divider>
                    {
                        this.state.twelvePesoTickets.map((item) => (
                            <Form.Item
                                {...formItemLayout}
                                label={
                                    <span>
                                            <Tooltip title="Input the last consumed ticket of this bundle">
                                                <Icon type="question-circle-o" className="field-guide"/>
                                            </Tooltip>
                                            Ticket No. {item.start_ticket} to
                                        </span>
                                }
                                key={item.id}
                            >
                                {
                                    getFieldDecorator('twelve_peso-'.concat(item.id), {
                                        rules: []
                                    })(
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        ))
                    }
                </div>
                }
                {this.state.fifteenPesoTickets && this.state.fifteenPesoTickets.length &&
                <div>
                    <Divider>15 Peso Tickets</Divider>
                    {
                        this.state.fifteenPesoTickets.map((item) => (
                            <Form.Item
                                {...formItemLayout}
                                label={
                                    <span>
                                            <Tooltip title="Input the last consumed ticket of this bundle">
                                                <Icon type="question-circle-o" className="field-guide"/>
                                            </Tooltip>
                                            Ticket No. {item.start_ticket} to
                                        </span>
                                }
                                key={item.id}
                            >
                                {
                                    getFieldDecorator('fifteen_peso-'.concat(item.id), {
                                        rules: []
                                    })(
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        ))
                    }
                </div>
                }
                <Divider orientation="left"> Other Information </Divider>
                <Form.Item
                    {...formItemLayout}
                    label={
                        <span>
                            <Tooltip title="Input costs made from buying fuel">
                                <Icon type="question-circle-o" className="field-guide"/>
                            </Tooltip>
                            Fuel Costs
                        </span>
                    }
                >
                    {
                        getFieldDecorator('fuel_costs', {
                            rules: []
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={
                        <span>
                            <Tooltip title="Input the OR number of the receipt acquired from buying fuel">
                                <Icon type="question-circle-o" className="field-guide"/>
                            </Tooltip>
                            OR Number
                        </span>
                    }
                >
                    {
                        getFieldDecorator('or_number', {
                            rules: []
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={
                        <span>
                            <Tooltip title="Input other costs acquired during deployment">
                                <Icon type="question-circle-o" className="field-guide"/>
                            </Tooltip>
                            Other Costs
                        </span>
                    }
                >
                    {
                        getFieldDecorator('other_costs', {
                            rules: []
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
                <div className="form-footer">
                    <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleSubmit} type="primary">
                        Submit
                    </Button>
                </div>
            </Form>
        );
    }
}