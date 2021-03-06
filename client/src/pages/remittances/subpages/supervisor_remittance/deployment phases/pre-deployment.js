import React, { Component } from 'react';
import { List, Avatar, Button, Modal, message, Select, Tag, Popover, Empty, Badge, Row, Col, Divider, Icon, Tooltip, Popconfirm } from 'antd';
import '../revised-style.css';
import { UserAvatar } from '../../../../../components/avatar/avatar';
import { postData } from '../../../../../network_requests/general';
import ButtonGroup from 'antd/lib/button/button-group';

export class PreDeployment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="phase-container">
                <Header
                    title="Pre-Deployment"
                    description="Deploy drivers for the day"
                />
                <DeploymentList
                    plannedDrivers={this.props.plannedDrivers}
                />
            </div>
        );
    }
}

function Header(props) {
    return (
        <div className="phase-header">
            <DeploySubButtons />
            <h3 className="phase-header-title"> {props.title} </h3>       
            <h5 className="phase-header-description"> {props.description} 
            <Divider type="vertical"/> 
            <AssignedDrivers />
            </h5>      
        </div>
    );
}

class AssignedDrivers extends  React.Component {
    constructor(props){
        super(props);

        this.state = {
            'assigned_drivers': [],
            'visible': false
        }

    }

    componentDidMount(){
        this.fetchAssignedDrivers();
    }


    fetchAssignedDrivers(){
        const supervisor = JSON.parse(localStorage.user_staff);
        
        fetch('/remittances/deployments/assigned/' + supervisor.id)
            .then(response => {return response;})
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    this.setState({
                        assigned_drivers: data.drivers
                    });
                    console.log(this.state.ten_total)
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
      }
    
    handleOk = () => {
        this.setState({
          visible: false,
        });
    }
    
    handleCancel = (e) => {
        this.setState({
          visible: false,
        });
    }

    render(){
        return(
            <span>
                <span onClick={this.showModal} className="assigned-driver-button">
                    Assigned Drivers
                </span>
                <Modal
                    title="Assigned Drivers"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {
                        this.state.assigned_drivers.map((item) => (
                            <Row gutter={5}>
                                <Col span={8}>
                                    <span className="driver-name">
                                        {item.name}:
                                    </span>
                                </Col>
                                {item.timeIn == null ? (
                                    <Col span={16}>
                                        Haven't Timed-In
                                    </Col>
                                ) : (
                                    <Col span={16}>
                                        {item.timeIn}
                                    </Col>
                                )}
                            </Row>
                        ))
                    }
                </Modal>
            </span>
        )
    }
}


class DeploySubButtons extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return(
            <span className="deploy-sub-container">
                <RevisedSubButton />
            </span>
        )
    }
}


class RevisedSubButton extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            'modal_is_visible': false,
            'sub_driver_id': null,
            'is_disabled': true,
            'ten_peso_tickets': [],
            'twelve_peso_tickets': [],
            'fifteen_peso_tickets': [],
            'ten_total': 0,
            'twelve_total': 0,
            'fifteen_total': 0,
            'driver_name': null,
            'driver_shuttle': null,
            'driver_route': null,
            'absent_id': null,
        }

        this.handleSubDriverChange = this.handleSubDriverChange.bind(this);
        this.handleAbsentChange = this.handleAbsentChange.bind(this);
    }

    showModal = () => {
        this.setState({
            'modal_is_visible': true,
        });
    }

    handleOk = () => {
        this.handleDeploy();
        this.setState({
            'modal_is_visible': false,
        });


    }

    handleDeploy() {
        const supervisor = JSON.parse(localStorage.user_staff);
        console.log(supervisor)
        let deploy = {
            'supervisor_id': supervisor.id,
            'driver_id': this.state.sub_driver_id,
            'absent_id': this.state.absent_id
        }

        postData('remittances/deployments/deploy-sub/', deploy)
            .then(response => {
                if (!response.error) {
                    message.success("A sub-driver has been deployed");
                } else {
                    console.log(response.error);
                }
            });
    }

    handleCancel = () => {
        this.setState({
            'modal_is_visible': false,
        });
    }

    handleSubDriverChange(sub_driver_id) {
        this.setState({
            'sub_driver_id': sub_driver_id,
        });
        this.fetchSubDriverTickets(sub_driver_id);
    }

    handleAbsentChange(id, name, shuttle, route) {
        this.setState({
            'absent_id': id,
            'driver_name': name,
            'driver_shuttle': shuttle,
            'driver_route': route,
        })
    }

    fetchSubDriverTickets(sub_driver_id) {
        console.log('entered here', sub_driver_id)
        fetch('/remittances/tickets/driver/' + sub_driver_id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    if (this.props.route == 'Main Road'){
                        console.log(this.state.ten_total)
                        if (data.ten_total >= 50 && data.twelve_total >= 80 && data.fifteen_total >= 50)
                            var is_disabled = false
                        else
                            var is_disabled = true
                    } else {
                        if (data.ten_total >= 50 && data.twelve_total >= 80)
                            var is_disabled = false
                        else
                            var is_disabled = true
                    }

                    this.setState({
                        ten_total: data.ten_total,
                        ten_peso_tickets: data.ten_peso_tickets,
                        twelve_total: data.twelve_total,
                        twelve_peso_tickets: data.twelve_peso_tickets,
                        fifteen_total: data.fifteen_total,
                        fifteen_peso_tickets: data.fifteen_peso_tickets,
                        is_disabled: is_disabled
                    });

                    console.log(this.state.ten_total)
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    render(){
        return(
            <span>
                <Button value="small" block icon="user-add" onClick={this.showModal}>
                        Sub
                </Button>
                <Modal
                    title="Deploy a sub-driver"
                    visible={this.state.modal_is_visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Deploy"
                    okButtonProps={this.state.is_disabled ?
                        { disabled: true } : { disabled: false }
                    }
                >
                    <RevisedSubContent 
                        onSelectChange={this.handleSubDriverChange}
                        onAbsentChange={this.handleAbsentChange}
                        shuttle={this.state.driver_shuttle}
                        driver_name={this.state.driver_name}
                        route={this.state.driver_route}
                        ten_total={this.state.ten_total}
                        twelve_total={this.state.twelve_total}
                        fifteen_total={this.state.fifteen_total}
                        ten_peso_tickets={this.state.ten_peso_tickets}
                        twelve_peso_tickets={this.state.twelve_peso_tickets}
                        fifteen_peso_tickets={this.state.fifteen_peso_tickets}
                    />
                </Modal>
            </span>
        );
    }
}

class RevisedSubContent extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            "absentDrivers": [],
            "subDrivers": []
        }

        this.handleSubChange = this.handleSubChange.bind(this);
        this.handleAbsentChange = this.handleAbsentChange.bind(this);
    }

    componentDidMount() {
        this.fetchAbsentDrivers();
        this.fetchSubDrivers();
    }

    fetchAbsentDrivers() {
        let supervisor = JSON.parse(localStorage.user_staff);
        fetch('/remittances/deployments/absent/' + supervisor.id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    this.setState({
                        absentDrivers: data.absent_drivers
                    });
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    handleAbsentChange(value) {
        let driver = null
        let absentDrivers = this.state.absentDrivers;
        for(var i=0; i<absentDrivers.length; i++){
            console.log("entered here")
            if(this.state.absentDrivers[i]["driver"]["id"] == value)
                driver = this.state.absentDrivers[i];
        }
        let driver_id = driver.driver.id;
        let driver_name = driver.driver.name;
        let driver_shuttle = "#" + driver.shuttle.shuttle_number + " - " + driver.shuttle.plate_number;
        let driver_route = null;

        if(driver.shuttle.route == "M")
            driver_route = "Main Road";
        else if(driver.shuttle.route == "R")
            driver_route = "Kaliwa";
        else
            driver_route = "Kanan";
        
        this.props.onAbsentChange(driver_id, driver_name, driver_shuttle, driver_route);
    }

    handleSubChange(value) {
        this.props.onSelectChange(value);
    }


    fetchSubDrivers() {
        let supervisor = JSON.parse(localStorage.user_staff);
        fetch('/remittances/shifts/sub_drivers/' + supervisor.id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    this.setState({
                        subDrivers: data.sub_drivers
                    });
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    render() {
        const { Option, OptGroup } = Select;
        return(
            <div className="modal-container">
                <div className="select-group">
                    <label className="sub-driver-label">
                        Absent Driver:
                    </label>
                    <Select onChange={this.handleAbsentChange} style={{ width: 200 }}>
                        {
                            this.state.absentDrivers.map((item) => (
                                <option value={item.driver.id} key={item.driver.id}>
                                    {item.driver.name}
                                </option>
                            ))
                        }
                    </Select>
                </div>
                <div className="select-group">
                    <label className="sub-driver-label">
                        Subdrivers:
                    </label>
                    <Select onChange={this.handleSubChange} style={{ width: 200 }}>
                        <OptGroup label="Supervisor">
                            {
                                this.state.subDrivers.map((item) =>{
                                    if(item.driver.is_supervisor == true)
                                        return (
                                            <option value={item.driver.id} key={item.driver.id}>
                                                {item.driver.name}
                                            </option>
                                        )

                                })
                            }
                        </OptGroup>
                        <OptGroup label="Other Drivers">
                        {
                                this.state.subDrivers.map((item) =>{
                                    if(item.driver.is_supervisor == false)
                                        return (
                                            <option value={item.driver.id} key={item.driver.id}>
                                                {item.driver.name}
                                            </option>
                                        )

                                })
                            }
                        </OptGroup>
                    </Select>
                </div>
                <div className="sub-deployment-details">
                    <Divider orientation="left">
                        Deployment Details
                    </Divider>
                    <DetailItems
                        title="Subbing in for "
                        value={this.props.driver_name}
                    />
                    <DetailItems
                        title="Shuttle"
                        value={this.props.shuttle}
                    />
                    <DetailItems
                        title="Route"
                        value={this.props.route}
                    />

                    <div className="ticket-tags-container">
                        <TicketDisplay
                            amount="₱10"
                            tickets={this.props.ten_peso_tickets}
                            total={this.props.ten_total}
                        />
                        <TicketDisplay
                            amount="₱12"
                            tickets={this.props.twelve_peso_tickets}
                            total={this.props.twelve_total}
                        />
                        {this.props.route == 'Main Road' &&
                            <TicketDisplay
                                amount="₱15"
                                tickets={this.props.fifteen_peso_tickets}
                                total={this.props.fifteen_total}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function DeploymentList(props) {
    return (
        <div className="list-container">
            <List
                itemLayout="horizontal"
                dataSource={props.plannedDrivers}
                bordered={true}
                renderItem={
                    item => (
                        <div className="list-detail-container">
                            <List.Item>
                                <DeploymentListDetails
                                    id={item.driver.id}
                                    name={item.driver.name}
                                    shuttle={"#" + item.shuttle.shuttle_number + " - " + item.shuttle.plate_number}
                                    route={item.shuttle.route}
                                    expected_departure={item.expected_departure}
                                    photo={item.driver.photo}
                                    ten_tickets={item.ten_peso_tickets}
                                    twelve_tickets={item.twelve_peso_tickets}
                                    fifteen_tickets={item.fifteen_peso_tickets}
                                    shuttle_obj={item.shuttle}
                                    ten_total={item.ten_total}
                                    fifteen_total={item.fifteen_total}
                                    twelve_total={item.twelve_total}
                                    is_late={item.is_late}
                                    is_shuttle_deployed={item.is_shuttle_deployed}
                                    deploy_with_back_up={item.deploy_with_back_up}
                                />
                            </List.Item>
                        </div>
                    )
                }
            />
        </div>
    );
}

function DeploymentListDetails(props) {
    const driver_id = props.id;
    const driver_name = props.name;
    const supervisor = JSON.parse(localStorage.user_staff);
    const firstLetter = props.name.split(" ")[0].charAt(0);
    const secondLetter = props.name.split(" ")[1].charAt(0);

    if (props.route == 'Main Road' || props.route == 'M') {
        var route_label = 'Main Road'
        var tag_color = 'blue';
        if (props.ten_total >= 50 && props.twelve_total >= 80 && props.fifteen_total >= 50 && (props.is_shuttle_deployed == false || props.deploy_with_back_up == true))
            var is_disabled = false;
        else
            var is_disabled = true;
    } else if (props.route == 'Kaliwa' || props.route == 'L') {
        var route_label = "Left Route"
        var tag_color = 'orange';
        if (props.ten_total >= 50 && props.twelve_total >= 80 && (props.is_shuttle_deployed == false || props.deploy_with_back_up == true))
            var is_disabled = false;
        else
            var is_disabled = true;
    } else {
        var route_label = "Right Route"
        var tag_color = 'green';
        if (props.ten_total >= 50 && props.twelve_total >= 80 && (props.is_shuttle_deployed == false || props.deploy_with_back_up == true))
            var is_disabled = false;
        else
            var is_disabled = true;
    }


    return (
        <div>
            <div className="deployment-header">
                <Avatar 
                    src={props.photo} 
                    style={{ backgroundColor: '#68D3B7' }} 
                    shape="square"
                    icon="user"
                    />
                <span className="deployment-name">
                    {props.name}
                </span>
                <Tag color={tag_color} className="route-tag">
                    {route_label}
                </Tag>
                {props.is_late == true &&
                    <span className="late-tag">
                        <Tag color="red" >
                            Late
                        </Tag>
                    </span>
                }
            </div>

            <div className="deployment-list-container">
                {props.shuttle_obj.status == 'A' && props.is_shuttle_deployed == false ? (
                    <DetailItems
                        title="Shuttle"
                        value={props.shuttle}
                    />
                ) : (
                        <div className="detail-container">
                            <span className="detail-items-title">
                                Shuttle:
                            </span>
                            {props.is_shuttle_deployed == true ? (
                                <Tooltip title="shuttle still deployed" placement="right">
                                    <span className="detail-items-value">
                                        <Badge dot status="warning">{props.shuttle}</Badge>
                                    </span>
                                </Tooltip>
                            ):(
                                <Tooltip title="shuttle unavailable" placement="right">
                                    <span className="detail-items-value">
                                        <Badge dot status="error">{props.shuttle}</Badge>
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                )}
                <DetailItems
                    title="Expected Departure"
                    value={props.expected_departure}
                />

                <div className="ticket-tags-container">
                    <TicketDisplay
                        amount="₱10"
                        tickets={props.ten_tickets}
                        total={props.ten_total}
                    />
                    <TicketDisplay
                        amount="₱12"
                        tickets={props.twelve_tickets}
                        total={props.twelve_total}
                    />
                    {route_label == 'Main Road' &&
                        <TicketDisplay
                            amount="₱15"
                            tickets={props.fifteen_tickets}
                            total={props.fifteen_total}
                        />
                    }
                </div>
            </div>

            <DeploymentButtons
                supervisor_id={supervisor.id}
                driver_id={driver_id}
                driver_name={driver_name}
                shuttle={props.shuttle}
                route={route_label}
                shuttle_obj={props.shuttle_obj}
                is_disabled={is_disabled}
                deploy_with_back_up={props.deploy_with_back_up}
            />
        </div>
    );
}

export function TicketDisplay(props) {
    if (props.total >= 100) {
        var content = (
            <div className="popover-container">
                {
                    props.tickets.map((item) => (
                        <div className="ticket-wrapper">
                            <span className="ticket-label">
                                Ticket No.:
                            </span>
                            <span>
                                {item.range_from} - {item.range_to}
                            </span>
                        </div>
                    ))
                }
                <div className="ticket-total-wrapper">
                    <span className="ticket-total-label">
                        Total:
                    </span>
                    <span className="ticket-total">
                        {props.total}
                    </span>
                </div>
            </div>
        )

        return (
            <span className="ticket-tag-wrapper">
                <Popover content={content} title={props.amount + " tickets"}>
                    <Tag className="ticket-tag">
                        {props.amount}
                    </Tag>
                </Popover>
            </span>

        );

    } else if (props.total > 0 && props.total < 130) {
        var badge_status = props.total >= 100 ? 'warning' : 'error';

        var content = (
            <div className="popover-container">
                {
                    props.tickets.map((item) => (
                        <div className="ticket-wrapper">
                            <span className="ticket-label">
                                Ticket No.:
                            </span>
                            <span>
                                {item.range_from} - {item.range_to}
                            </span>
                        </div>
                    ))
                }
                <div className="ticket-total-wrapper">
                    <span className="ticket-total-label">
                        Total:
                    </span>
                    <span className="ticket-total">
                        {props.total} pcs
                    </span>
                    <Divider type="vertical"></Divider>
                    <a href={"http://localhost:3000/tickets"} className="link-to-tickets">
                        assign tickets
                    </a>
                </div>
            </div>
        )

        return (
            <span className="ticket-tag-wrapper">
                <Popover content={content} title={props.amount + " tickets"}>
                    <Badge dot status={badge_status}>
                        <Tag className="ticket-tag">
                            {props.amount}
                        </Tag>
                    </Badge>
                </Popover>
            </span>

        );

    } else {
        var content = (
            <Empty
                description={(
                    <a href={"http://localhost:3000/tickets"}>
                        Assign tickets to driver
                    </a>
                )}
            />
        )

        return (
            <span className="ticket-tag-wrapper">
                <Popover content={content} title={props.amount + " tickets"}>
                    <Badge dot>
                        <Tag className="ticket-tag">
                            {props.amount}
                        </Tag>
                    </Badge>
                </Popover>
            </span>

        );
    }


}

function DetailItems(props) {
    return (
        <div className="detail-container">
            <span className="detail-items-title">
                {props.title}:
            </span>
            <span className="detail-items-value">
                {props.value}
            </span>
        </div>
    );
}

function DeploymentButtons(props) {
    const supervisor_id = props.supervisor_id
    const driver_id = props.driver_id
    const driver_name = props.driver_name

    if(props.shuttle_obj.status == 'A' && props.deploy_with_back_up == false){
        var is_normal = true
    } else {
        var is_normal = false
    }

    function showConfirm() {
        Modal.confirm({
            title: 'Are you sure you want to deploy this driver?',
            content: 'Deploying this driver would start his/her time for the shift.',

            onOk() {
                handleDeploy();

                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            },

            onCancel() { },
        });
    }

    function handleDeploy() {
        console.log(supervisor_id)
        let deploy = {
            'supervisor_id': supervisor_id,
            'driver_id': driver_id
        }

        postData('remittances/deployments/', deploy)
            .then(response => {
                if (!response.error) {
                    message.success(driver_name + " has been deployed");
                } else {
                    console.log(response.error);
                }
            });
    }

    return (
        <div className="deployment-button-container">
            <DayOffButton 
                driver_id={props.driver_id}
            />
            
            {is_normal ? (
                <Button
                    type="primary"
                    className="deployment-button"
                    onClick={showConfirm}
                    disabled={props.is_disabled}
                >
                    Deploy
                </Button>
            ) : (
                <DeployWithDiffShuttle
                    driver_id={props.driver_id}
                    shuttle_display={props.shuttle}
                    supervisor_id={supervisor_id}
                    driver_name={driver_name}
                    is_disabled={props.is_disabled}
                    is_shuttle_available={props.shuttle_obj.status == "A" ? true : false}
                />
            )}
        </div>
    );
}

class DayOffButton extends React.Component {
    constructor(props){
        super(props);

        this.handleDayOff = this.handleDayOff.bind(this);
    }

    handleDayOff() {
        let data = {"driver_id": this.props.driver_id}
        postData('remittances/deployments/dayoff/', data)
            .then(response => {
                if (!response.error) {
                    message.success("Driver now takes the dayoff");
                } else {
                    console.log(response.error);
                }
            });
    }

    render(){
        return(
            <Popconfirm title="Are you sure?" onConfirm={this.handleDayOff} okText="Yes" cancelText="No">
                <Button>Day-off</Button>
            </Popconfirm>
            
        );
    }
}

class DeployWithDiffShuttle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'modal_is_visible': false,
            'shuttle_id': null,
            'driver_id': this.props.driver_id,
            'backup_shuttles': [],
            'is_modal_ok_disabled': true
        }
        this.handleShuttleChange = this.handleShuttleChange.bind(this);
    }

    componentDidMount() {
        this.fetchBackUpShuttles();
    }

    showModal = () => {
        this.setState({
            'modal_is_visible': true,
        });
    }

    handleOk = () => {
        this.handleDeploy();

        this.setState({
            'modal_is_visible': false,
        });
    }

    handleCancel = () => {
        this.setState({
            'modal_is_visible': false,
        });
    }

    handleShuttleChange = (shuttle_id) => {
        this.setState({
            'shuttle_id': shuttle_id
        });
    }

    handleDeploy() {
        let deploy = {
            'supervisor_id': this.props.supervisor_id,
            'shuttle_id': this.state.shuttle_id,
            'driver_id': this.state.driver_id
        }

        postData('remittances/deployments/back-up-shuttles/deploy/', deploy)
            .then(response => {
                if (!response.error) {
                    message.success(this.props.driver_name + " has been deployed with back-up shuttle");
                } else {
                    console.log(response.error);
                }
            });
    }

    fetchBackUpShuttles() {
        fetch('/remittances/deployments/back-up-shuttles/')
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    this.setState({
                        backup_shuttles: data.shuttles
                    });

                    if(data.shuttles.length != 0)
                        this.setState({
                            is_modal_ok_disabled: false
                        }) 
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }
    
    render() {
        return (
            <div className="subButton-container">
                <Button
                    className="deployment-button"
                    type="primary"
                    onClick={this.showModal}
                    disabled={this.props.is_disabled}
                >
                    Deploy
                </Button>
                <Modal
                    title="Deploy with a Back-up Shuttle"
                    visible={this.state.modal_is_visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Deploy"
                    okButtonProps={this.state.is_modal_ok_disabled ?
                        { disabled: true } : { disabled: false }
                    }
                >
                    <DeployShuttleContent
                        shuttle_display={this.props.shuttle_display}
                        handleShuttleChange={this.handleShuttleChange}
                        is_shuttle_available={this.props.is_shuttle_available}
                        backUpShuttles={this.state.backup_shuttles}
                    />
                </Modal>
            </div>
        );
    }
}

class DeployShuttleContent extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        this.props.handleShuttleChange(value);
    }

    render() {
        return (
            <div className="modal-container">
                <div>
                    {this.props.is_shuttle_available ? (
                        <span>
                            <span>
                                {"Shuttle No." + this.props.shuttle_display + " "}
                            </span>
                            <span>
                                is still <b>on deployment</b> with another driver
                            </span>
                        </span>
                    ) : (
                        <span>
                            <span>
                                {"Shuttle No." + this.props.shuttle_display + " "}
                            </span>
                            <span>
                                is currently <b>under maintenance</b>
                            </span>
                        </span>
                    )}
                </div>
                <Divider></Divider>
                <Row gutter={16}>
                    <Col span={8}>
                        <label className="shuttle-label">
                            Back-Up Shuttle:
                        </label>
                    </Col>
                    <Col span={16}>
                        <Select onChange={this.handleChange} style={{ width: 200 }}>
                            {
                                this.props.backUpShuttles.map((item) => (
                                    <option value={item.id} key={item.id}>
                                        Shuttle#{item.shuttle_number} - {item.plate_number}
                                    </option>
                                ))
                            }
                        </Select>
                        {this.props.backUpShuttles.length == 0 &&
                            <div>
                                <div>There is no back-up shuttle available</div>
                                <div>Driver should be day-offed</div>
                            </div>
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}

class SubButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'modal_is_visible': false,
            'driver_id': this.props.driver_id,
            'sub_driver_id': null,
            'is_disabled': true,
            'ten_peso_tickets': [],
            'twelve_peso_tickets': [],
            'fifteen_peso_tickets': [],
            'ten_total': 0,
            'twelve_total': 0,
            'fifteen_total': 0
        }

        this.handleSubDriverChange = this.handleSubDriverChange.bind(this);
    }

    showModal = () => {
        this.setState({
            'modal_is_visible': true,
        });
    }

    handleOk = () => {
        this.handleDeploy();

        this.setState({
            'modal_is_visible': false,
        });
    }

    handleCancel = () => {
        this.setState({
            'modal_is_visible': false,
        });
    }

    handleSubDriverChange(sub_driver_id) {
        this.setState({
            'sub_driver_id': sub_driver_id,
        });
        this.fetchSubDriverTickets(sub_driver_id);
    }

    fetchSubDriverTickets(sub_driver_id) {
        console.log('entered here', sub_driver_id)
        fetch('/remittances/tickets/driver/' + sub_driver_id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    if (this.props.route == 'Main Road'){
                        console.log(this.state.ten_total)
                        if (data.ten_total >= 100 && data.twelve_total >= 100 && data.fifteen_total >= 100)
                            var is_disabled = false
                        else
                            var is_disabled = true
                    } else {
                        if (data.ten_total >= 100 && data.twelve_total >= 100)
                            var is_disabled = false
                        else
                            var is_disabled = true
                    }

                    this.setState({
                        ten_total: data.ten_total,
                        ten_peso_tickets: data.ten_peso_tickets,
                        twelve_total: data.twelve_total,
                        twelve_peso_tickets: data.twelve_peso_tickets,
                        fifteen_total: data.fifteen_total,
                        fifteen_peso_tickets: data.fifteen_peso_tickets,
                        is_disabled: is_disabled
                    });

                    console.log(this.state.ten_total)
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    handleDeploy() {
        let deploy = {
            'supervisor_id': this.props.supervisor_id,
            'driver_id': this.state.sub_driver_id,
            'absent_id': this.state.driver_id
        }

        postData('remittances/deployments/deploy-sub/', deploy)
            .then(response => {
                if (!response.error) {
                    message.success("A sub-driver has been deployed for " + this.props.driver_name);
                } else {
                    console.log(response.error);
                }
            });
    }

    render() {
        return (
            <div className="subButton-container">
                <Button className="deployment-button" onClick={this.showModal}>
                    Sub
                </Button>
                <Modal
                    title="Deploy a sub-driver"
                    visible={this.state.modal_is_visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Deploy"
                    okButtonProps={this.state.is_disabled ?
                        { disabled: true } : { disabled: false }
                    }
                >
                    <SubContent
                        onSelectChange={this.handleSubDriverChange}
                        supervisor_id={this.props.supervisor_id}
                        shuttle={this.props.shuttle}
                        driver_name={this.props.driver_name}
                        route={this.props.route}
                        ten_total={this.state.ten_total}
                        twelve_total={this.state.twelve_total}
                        fifteen_total={this.state.fifteen_total}
                        ten_peso_tickets={this.state.ten_peso_tickets}
                        twelve_peso_tickets={this.state.twelve_peso_tickets}
                        fifteen_peso_tickets={this.state.fifteen_peso_tickets}
                    />
                </Modal>
            </div>
        );
    }
}

class SubContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'supervisor_id': this.props.supervisor_id,
            'subDrivers': [],
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.fetchSubDrivers();
    }

    fetchSubDrivers() {
        console.log(this.state.supervisor_id)
        fetch('/remittances/shifts/sub_drivers/' + this.state.supervisor_id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    this.setState({
                        subDrivers: data.sub_drivers
                    });
                }
                else {
                    console.log(data.error)
                }
            }).catch(error => console.log(error));
    }

    handleChange(value) {
        this.props.onSelectChange(value);  
    }

    render() {
        return (
            <div className="modal-container">
                <div className="select-group">
                    <label className="sub-driver-label">
                        Subdrivers:
                    </label>
                    <Select onChange={this.handleChange} style={{ width: 200 }}>
                        {
                            this.state.subDrivers.map((item) => (
                                <option value={item.driver.id} key={item.driver.id}>
                                    {item.driver.name}
                                </option>
                            ))
                        }
                    </Select>
                </div>
                <div className="sub-deployment-details">
                    <Divider orientation="left">
                        Deployment Details
                    </Divider>
                    <DetailItems
                        title="Subbing in for "
                        value={this.props.driver_name}
                    />
                    <DetailItems
                        title="Shuttle: "
                        value={this.props.shuttle}
                    />
                    <DetailItems
                        title="Route: "
                        value={this.props.route}
                    />

                    <div className="ticket-tags-container">
                        <TicketDisplay
                            amount="₱10"
                            tickets={this.props.ten_peso_tickets}
                            total={this.props.ten_total}
                        />
                        <TicketDisplay
                            amount="₱12"
                            tickets={this.props.twelve_peso_tickets}
                            total={this.props.twelve_total}
                        />
                        {this.props.route == 'Main Road' &&
                            <TicketDisplay
                                amount="₱15"
                                tickets={this.props.fifteen_peso_tickets}
                                total={this.props.fifteen_total}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}