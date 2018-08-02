import React, {Component} from 'react'
import {Icon} from 'react-icons-kit'
import PerfectScrollbar from '@opuscapita/react-perfect-scrollbar';
import {List, Row, Col, Menu, Button, Modal, Form, message, Input} from 'antd'
import {ic_loop} from 'react-icons-kit/md/ic_loop'
import {postData, getData} from "../../../network_requests/general"
import {ic_access_time} from 'react-icons-kit/md/ic_access_time'
import {ic_navigate_next} from 'react-icons-kit/md/ic_navigate_next'
import {withMinus} from 'react-icons-kit/entypo/withMinus'
import {plus} from 'react-icons-kit/entypo/plus'
import {AddItems} from './add_item_modal'

const div_style = {border: 'solid', width: '100%',
             borderColor: '#E8E8E8', borderRadius: 5,
             borderWidth: 1, padding: 20,
             backgroundColor: 'white', height: '78vh'}

function hasErrors(fieldsError){
    return Object.keys(fieldsError).some(field=>fieldsError[field])
}

class FindingsFormInit extends Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            repair: props.repair,
            uuid: 0
        }
    }

    remove = (k) => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        if(keys.length === 1){
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        })
    }

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.state.uuid);
        this.setState({
            uuid: this.state.uuid + 1,
        })
        form.setFieldsValue({
            keys:nextKeys,
        });
    }

    handleSubmit(e){
        e.preventDefault();
        const {repair} = this.props;
        this.props.form.validateFields((err, values)=>{
            if(typeof values['findings'] === 'undefined'){
                message.warning('Add problem fields!');
            }
            if(!err && typeof values['findings'] !== 'undefined'){
                let cleaned_findings = values['findings']
                                .filter(function(n){return n!= undefined})
                const data = {
                    findings: cleaned_findings,
                }

                postData('inventory/mechanic/repairs/' + repair.id, data)
                    .then(response => {
                        return response;
                    })
                    .then(data => {
                        if(!data.error){
                            this.props.loadFindings(data)
                        }else{
                            console.log(data.error)
                        }
                    })

                this.props.close();
                message.success('Findings added!')
            }
        })
    }

    render(){
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Findings' : ''}
                    required={true}
                    key={k}>
                    {getFieldDecorator(`findings[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: 'Please input finding',
                        }],
                    })(
                        <Input className='finding' placeholder='Finding' style={{width: '80%', marginRight: 8}}/>
                    )}
                    {keys.length > 1 ?(
                        <Icon
                            className="dynamic-delete-button" icon={withMinus}
                            disabled={keys.length === 1} onClick={() => this.remove(k)}/>
                    ) : null}
                </Form.Item>
            );
        });
        return(
            <Form onSubmit={this.handleSubmit} hideRequiredMark={true}>
                {formItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '80%' }}>
                        <Icon icon={plus} /> Add problem
                    </Button>
                </Form.Item>
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        )
    }
}

const FindingsForm = Form.create()(FindingsFormInit)

export class MechanicView extends Component{
    constructor(props){
        super(props);
        this.state = {
            repairs: [],
            loadedRepair: '',
            problems: '',
            findings: '',
            modifications: '',
            currentTab: 1,
            findingsModal: false,
            itemsModal: false,
        }
    }

    setfindingsVisible(findingsModal){
        this.setState({findingsModal})
    }

    setItemsVisible(itemsModal){
        this.setState({itemsModal})
    }

    componentDidMount(){
        fetch('inventory/mechanic/repairs')
            .then(response => response.json())
            .then(
                data => {
                    if(!data.error){
                        this.setState({
                            repairs: data.repairs
                        })
                    } else {
                        console.log(data.error)
                    }
                }
            )
    }

    loadFindings(findings){
        console.log('aw')
        this.setState({
            findings: findings,
        })
    }

    loadNewRepair = (record) => {
        fetch('inventory/shuttles/repairs/specific/' + record.id)
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(data => this.setState({
                problems: data.problems,
                findings: data.findings,
                modifications: data.modifications,
                loadedRepair: record,
            }))
    };

    handleClick = (e) => {
        let content;
        switch (e.key){
            case '1':
                content = 1;
                break;
            case '2':
                content = 2;
                break;
            case '3':
                content = 3;
                break;
        }
        this.setState({
            currentTab: content,
        })
    }

    renderCurrentPage = () => {
        const {currentTab, problems, findings, modifications, loadedRepair} = this.state;
        switch (currentTab) {
            case 1:
                return (
                    <List bordered size='small'>
                        {problems.map(function(problem, index){
                            return (
                                <List.Item>{problem.description}</List.Item>
                            )
                        })}
                    </List>);
            case 2:
                return (
                    <div>
                        {findings.length == 0 ? '' :
                            (
                                <List size='small'
                                      bordered>
                                      {findings.map(function(finding, index){
                                      return (
                                          <List.Item>{finding.description}</List.Item>
                                      )})}
                                </List>
                        )}
                        <br/>
                        <Button type='dashed' onClick={() => this.setfindingsVisible(true)}
                            style={{width: '100%'}}>Add Finding</Button>
                        <Modal
                            title='Add Findings'
                            onCancel={() => this.setfindingsVisible(false)}
                            footer={null} visible={this.state.findingsModal}>
                            <FindingsForm repair={loadedRepair} loadFindings={this.loadFindings}
                                close={() => this.setfindingsVisible(false)}/>
                        </Modal>
                    </div>
                    );
            default:
                return (
                    <div>
                        {modifications.length == 0 ? '' :
                            (
                                <List size='small'
                                      bordered>
                                      {modifications.map(function(modification, index){
                                      return (
                                          <List.Item>{modification.quantity} &nbsp;
                                              {modification.item_used}</List.Item>
                                      )})}
                                </List>
                        )}
                        <br/>
                        <Button type='dashed' onClick={() => this.setItemsVisible(true)}
                            style={{width: '100%'}}>Add Item</Button>
                        <Modal
                            title='Add Items' width={450}
                            onCancel={() => this.setItemsVisible(false)}
                            footer={null} visible={this.state.itemsModal}>
                            <AddItems/>
                        </Modal>
                    </div>
                    );
        }
    }

    render(){
        const {repairs, loadedRepair, problems, findings, modifications} = this.state
        const loadNewRepair = this.loadNewRepair

        return(
            <div style={{padding: 10}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <div style={div_style}
                                     align='middle'>
                            {repairs.length == 0 ? (
                                <h2>There are no outstanding repairs</h2>
                            ) : (
                                <PerfectScrollbar>
                                    <List header={<h3>Repairs</h3>} bordered itemLayout='horizontal'>
                                            {repairs.map(function(repair, index){
                                                return(
                                                    <List.Item actions={[<Icon icon={ic_navigate_next}
                                                                    onClick={() => loadNewRepair(repair)}
                                                                    size={24} style={{verticalAlign: 'middle'}}/>]}>
                                                        <List.Item.Meta
                                                            avatar={<Icon icon={repair.status == 'NS' ?
                                                                            ic_access_time : ic_loop}
                                                                        style={{color: '#E9C46A'}}
                                                                        size={24}/>}
                                                            title={<h4>Repair {repair.id} </h4>}
                                                            description={'Date requested ' + repair.date_requested}
                                                            align="left"/>
                                                    </List.Item>
                                                )
                                            })}
                                    </List>
                                </PerfectScrollbar>
                            )}
                        </div>
                    </Col>
                    <Col span={16}>
                        <div style={div_style}>
                            {!loadedRepair ? (
                                <h2>Select a repair to load</h2>
                            ) : (
                                <PerfectScrollbar>
                                    <div align='left'>
                                        <h2>Repair: {loadedRepair.id}</h2>
                                        <h3>Shuttle {loadedRepair.shuttle}</h3>
                                        <p><i>Date Requested: {loadedRepair.date_requested}</i></p>
                                        <Menu onClick={this.handleClick} selectedKeys={[this.state.currentTab]}
                                              mode='horizontal'>
                                             <Menu.Item key={1}>
                                                 Problems
                                             </Menu.Item>
                                             <Menu.Item key={2}>
                                                 Findings
                                             </Menu.Item>
                                             <Menu.Item key={3}>
                                                 Items Used
                                             </Menu.Item>
                                        </Menu>
                                        <br/>
                                        {this.renderCurrentPage()}
                                    </div>
                                </PerfectScrollbar>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}