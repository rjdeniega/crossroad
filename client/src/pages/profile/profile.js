/**
 * Created by JasonDeniega on 16/11/2018.
 */
/**
 * Created by JasonDeniega on 24/05/2018.
 */
import React, { Component, Fragment } from "react"
import '../../utilities/colorsFonts.css'
import { List, Avatar } from 'antd'
import './style.css'
import emptyStateImage from '../../images/empty state record.png'
import users from '../../images/default.png'
import {
    Spin,
    Icon as AntIcon,
    Divider,
    Table,
    message,
    Modal,
    Button,
    Input,
    DatePicker,
    Select,
    InputNumber
} from 'antd';
import { Icon } from 'react-icons-kit'
import { driversLicenseO } from 'react-icons-kit/fa/driversLicenseO'
import { UserAvatar } from "../../components/avatar/avatar"
import { getData, postData, postDataWithImage } from '../../network_requests/general'
import moment from "moment";

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const Option = Select.Option;


const antIcon = <Icon type="loading" style={{ fontSize: 70, color: 'var(--darkgreen)' }} spin/>;
const share_columns = [{
    title: 'Date of Update',
    dataIndex: 'date_of_update',
    key: 'date_of_update',
    render: (text) => (
        <div>
            {text}
        </div>
    )
}, {
    title: 'Share Value',
    dataIndex: 'value',
    key: 'value',
    render: (text) => (
        <div className="rem-status">
            {parseInt(text)}
        </div>
    ),
}, {
    title: 'Peso value',
    dataIndex: 'peso_value',
    key: 'peso_value',
    render: (text) => (
        <div className="rem-status">
            <p><b>Php {parseInt(text)}</b></p>
        </div>
    ),
}];
const columns = [{
    title: 'Date',
    dataIndex: 'shift_date',
    key: 'shift_date',
    render: (text) => (
        <div>
            {text}
        </div>
    )
}, {
    title: 'Card Number',
    dataIndex: 'card_number',
    key: 'card_number',
    render: (text) => (
        <div className="rem-status">
            {text}
        </div>
    ),
}, {
    title: 'Transaction Cost',
    dataIndex: 'total',
    key: 'total',
    render: (text) => (
        <div className="rem-status">
            <p><b>Php {parseInt(text)}</b></p>
        </div>
    ),
}];
const carwash_columns = [{
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text) => (
        <div>
            {text}
        </div>
    )
}, {
    title: 'Receipt Number',
    dataIndex: 'receipt',
    key: 'receipt',
    render: (text) => (
        <div className="rem-status">
            {text}
        </div>
    ),
}, {
    title: 'Transaction Cost',
    dataIndex: 'total',
    key: 'total',
    render: (text) => (
        <div className="rem-status">
            <p><b>Php {parseInt(text)}</b></p>
        </div>
    ),
}];
export class ProfilePage extends Component {
    state = {
        users: null,
        visible: false,
        transactions_visible: false,
        name: null,
        address: null,

    };

    componentDidMount() {
        this.fetchMember()
        this.fetchMemberShares()
        this.fetchMemberTransactions()

    }

    componentDidUpdate() {
    }

    handleOk = () => {

    };
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            transactions_visible: false,
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    showTransactions = () => {
        this.setState({
            transactions_visible: true,
        });
    };

    fetchMemberShares() {
        const { id } = JSON.parse(localStorage.user_staff);
        getData('/members/shares/' + id).then(data => {
            console.log(data);
            this.setState({
                shares: data.shares,
                total_shares: data.total_shares,
                total_peso_value: data.total_peso_value,
            })
        });
    }

    fetchMemberTransactions() {
        const { id } = JSON.parse(localStorage.user_staff);
        getData('/members/transactions/' + id).then(data => {
            console.log(data.transactions);
            this.setState({
                transactions: data.transactions,
                total_transactions: data.total_transactions
            })
        });
        getData('/remittances/get_carwash_transaction/' + id).then(data => {
            console.log(data);
            this.setState({
                carwash_transactions: data.carwash_transactions,
                total_carwash_transactions: parseInt(data.carwash_transaction_total),
            })
        });
    }

    handleFormChange = fieldName => event => {
        return this.handleSelectChange(fieldName)(event.target.value);
        //this is asynchronous, it does not execute in order
        //if console.log is not in callback, it might execute before state is updated
    };
    handleSelectChange = fieldName => value => {
        // this function is to handle drop-downs
        const state = { ...this.state };
        state[fieldName] = value;
        this.setState({
            ...state
        });
    };
    handleNumberFormChange = fieldName => value => {
        return this.handleSelectChange(fieldName)(value);
        //this is asynchronous, it does not execute in order
        //if console.log is not in callback, it might execute before state is updated
    };
    convertSomething = () => {
        return moment(this.state.activeUser.birth_date).format('YYYY-MM-DD')
    };
    handleSubmit = () => {
        const data = {
            "name": this.state.name,
            "email": this.state.email,
            "sex": this.state.email,
            "address": this.state.address,
            "contact_no": this.state.contact_no,
            "educational_attainment": this.state.educational_attainment,
            "occupation": this.state.occupation,
            "religion": this.state.religion,
            "tin_number": this.state.tin_number,
            "annual_income": this.state.annual_income,
            "no_of_dependents": this.state.no_of_dependents,
            "civil_status": this.state.civil_status,
        };
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));
        console.log(formData);
        const { id } = JSON.parse(localStorage.user_staff);


        // for (const pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }
        postData('/members/profile/' + id, data)
            .then(data => {
                if (data.error) {
                    console.log("theres an error");
                    this.setState({
                        error: data["error"],
                    });
                    console.log(this.state.error);
                }
                else {
                    this.setState({
                        current: 0,
                    });
                    console.log(data);
                    console.log(data.user_staff);
                    this.props.handleOk(data.user_staff);
                }
            })
            .catch(error => console.log(error));

        message.success('Profile successfully edited!');
        this.setState({
            visible: false,
        });
    }
    renderMemberContent = () => (
        <div>
            {this.state.activeUser &&
            <Fragment>
                <Input type="file" placeholder="select image" onChange={this.handleFileChange}/>
                < Input onChange={this.handleFormChange("name")} defaultValue={this.state.name}
                        className="user-input"
                        type="text"
                        placeholder="enter name"/>
                <Select onChange={this.handleSelectChange("sex")} className="user-input"
                        defaultValue={this.state.sex}>
                    <Option value="M">Male</Option>
                    <Option value="F">Female</Option>
                </Select>
                <Input onChange={this.handleFormChange("address")} value={this.state.address}
                       className="user-input"
                       type="text"
                       placeholder="Enter address"/>
                <Input onChange={this.handleFormChange("email")} value={this.state.email}
                       className="user-input"
                       addonAfter=".com"
                       placeholder="Enter email address"/>
                <InputNumber onChange={this.handleNumberFormChange("contact_no")}
                             defaultValue={this.state.contact_no}
                             className="user-input" addonBefore="+639"
                             placeholder="Enter contact number"/>
                <InputNumber onChange={this.handleNumberFormChange("no_of_dependents")}
                             defaultValue={this.state.no_of_dependents}
                             className="user-input"
                             type="text"
                             placeholder="Enter number of dependents"/>
                <Input onChange={this.handleFormChange("occupation")} defaultValue={this.state.occupation}
                       className="user-input"
                       type="text"
                       placeholder="Enter Occupation"/>
                <Input onChange={this.handleFormChange("religion")} defaultValue={this.state.religion}
                       className="user-input"
                       type="text"
                       placeholder="Enter Religion"/>
                <Select onChange={this.handleSelectChange("civil_status")} className="user-input"
                        defaultValue={this.state.civil_status}>
                    <Option value="S">Single</Option>
                    <Option value="M">Married</Option>
                </Select>
                <Select onChange={this.handleSelectChange("educational_attainment")} className="user-input"
                        defaultValue={this.state.educational_attainment}>
                    <Option value="E">Elementary</Option>
                    <Option value="H">High School</Option>
                    <Option value="V">Vocational</Option>
                    <Option value="V">Bachelors Degree</Option>
                    <Option value="M">Masters Degree</Option>
                    <Option value="D">Doctorate</Option>
                </Select>
                <Input onChange={this.handleFormChange("tin_number")} defaultValue={this.state.tin_number}
                       className="user-input"
                       type="text"
                       placeholder="Enter Tin Number"/>
                <InputNumber onChange={this.handleNumberFormChange("annual_income")}
                             defaultValue={this.state.annual_income}
                             className="user-input"
                             type="text"
                             placeholder="Enter Annual Income"/>
                <Button onClick={this.handleSubmit}>Submit</Button>
            </Fragment>
            }
        </div>
    );

    fetchMember() {
        const { id } = JSON.parse(localStorage.user_staff);
        getData('/members/profile/' + id).then(data => {
            console.log(data);
            this.setState({
                activeUser: data.member,
            }, () => {
                this.setState({
                    name: this.state.activeUser.name,
                    email: this.state.activeUser.email,
                    sex: this.state.activeUser.email,
                    address: this.state.activeUser.address,
                    contact_no: this.state.activeUser.contact_no,
                    educational_attainment: this.state.activeUser.educational_attainment,
                    occupation: this.state.activeUser.occupation,
                    religion: this.state.activeUser.religion,
                    tin_number: this.state.activeUser.tin_number,
                    annual_income: this.state.activeUser.annual_income,
                    no_of_dependents: this.state.activeUser.no_of_dependents,
                    civil_status: this.state.activeUser.civil_status,
                })
                console.log(this.state)
            })
        })
    }

    onNewUserCreate = (user) => {
        this.setState({
            users: [user, ...this.state.users]
        })
    };

    fetchUsers() {
        return fetch('/staff_accounts').then(response => response.json()).then(data => {
            this.setState({
                users: data["people"].reverse()
            }, () => console.log(this.state.users));
        });
    }

    renderListItemPhoto = photoSrc => {
        console.log("Photo src", photoSrc);
        return photoSrc ? photoSrc : users
    };

    renderList = () => (
        <List
            className="user-list"
            itemLayout="horizontal"
            dataSource={(() => {
                console.log(this.state.users);
                return this.state.users;
            })()}
            renderItem={item => (
                <List.Item className="list-item">
                    <List.Item.Meta
                        avatar={this.renderListItemPhoto(item.photo)}
                        title={<p className="list-title">{item.name}</p>}
                        description={<p className="list-description"> operations manager</p>}
                    />
                </List.Item>
            )}
        />
    );

    render() {
        const { users, activeUser } = this.state;
        const isLoading = users === null;
        return (
            <div className="body-wrapper">
                <div className="header">
                    <div className="header-text">

                        <Modal
                            className="add-user-modal"
                            title="Edit Profile"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={null}
                        >
                            { this.renderMemberContent()}

                        </Modal>
                        <Icon className="page-icon" icon={driversLicenseO} size={42}/>
                        <div className="page-title"> My Profile</div>
                        <Button className="add-user" onClick={this.showModal}> Edit Profile </Button>
                        <div className="rem-page-description"> Manage your profile</div>
                    </div>
                    <UserAvatar/>
                </div>
                <div className="page-body">
                    {activeUser &&
                    <Fragment>
                        <div className="member-profile-container">
                            <div className="profile-container">
                                <div className="container">
                                    <div className="header-div">
                                        <img className="profile-image"
                                             src={this.renderListItemPhoto(activeUser.photo)}/>
                                        <div className="basic-info">
                                            <div className="info-row"><b>Name:</b> {activeUser.name}</div>
                                            <div className="info-row"><b>Contact Number:</b> {activeUser.contact_no}
                                            </div>
                                            <div className="info-row"><b>E-mail:</b> {activeUser.email}</div>
                                        </div>
                                    </div>
                                    <Divider orientation="left">Member Information</Divider>
                                    <div className="member-info">
                                        <div className="info-row-1"><b>Accepted date:</b> {activeUser.accepted_date}
                                        </div>
                                        <div className="info-row-2"><b>E-mail:</b> {activeUser.email}</div>
                                        <div className="info-row-1"><b>Withrawal
                                            date:</b> {activeUser.termination_date}
                                        </div>
                                        <div className="info-row-2"><b>Occupation:</b> {activeUser.occupation}</div>
                                        <div className="info-row-1"><b>Tin number:</b> {activeUser.tin_number}</div>
                                        <div className="info-row-2"><b>Educational
                                            Attainment:</b> {activeUser.educational_attainment}
                                        </div>
                                        <div className="info-row-1"><b>Religion:</b> {activeUser.religion}</div>
                                        <div className="info-row-2"><b>Sex:</b> {activeUser.sex}</div>
                                        <div className="info-row-1"><b>Address:</b> {activeUser.address}</div>
                                        <div className="info-row-2"><b>Annual Income:</b> {activeUser.annual_income}
                                        </div>
                                        <div className="info-row-1"><b>Card Number:</b> {activeUser.card_number}
                                        </div>
                                        <div className="info-row-2"><b>No of
                                            Dependents:</b> {activeUser.no_of_dependents}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tables">
                                <Modal
                                    className="add-user-modal"
                                    title="Transactions"
                                    visible={this.state.transactions_visible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                    footer={null}
                                >
                                    <div className="table-container">
                                        <div className="tab-label">
                                            Carwash transactions
                                        </div>
                                        <p> total transaction cost: <b>{this.state.total_carwash_transactions} </b></p>
                                        <Table bordered size="medium"
                                               className="remittance-table"
                                               columns={carwash_columns}
                                               dataSource={this.state.carwash_transactions}

                                        />
                                        <div className="beep-container">
                                            <div className="tab-label">
                                                Beep transactions
                                            </div>
                                            <p> total transaction cost: <b>{this.state.total_transactions} </b></p>
                                            <Table bordered size="medium"
                                                   className="remittance-table"
                                                   columns={columns}
                                                   dataSource={this.state.transactions}

                                            />
                                        </div>
                                    </div>

                                </Modal>

                                <div className="shares-container">
                                    <Button onClick={this.showTransactions}> View Transactions </Button>
                                    <div className="tab-label">
                                        Shares
                                    </div>
                                    <p> total shares: <b>{this.state.total_shares}</b></p>
                                    <p> total shares (in Php): <b>Php {this.state.total_peso_value}</b></p>

                                    <Table bordered size="medium"
                                           className="remittance-table profile-shares-table"
                                           columns={share_columns}
                                           dataSource={this.state.shares}
                                    />
                                </div>

                            </div>
                        </div>
                    </Fragment>
                    }
                </div>
            </div>
        );
    }
}


