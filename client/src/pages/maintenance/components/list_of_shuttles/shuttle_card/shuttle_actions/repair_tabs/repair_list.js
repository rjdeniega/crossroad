import React, {Component} from 'react'
import {Icon} from 'react-icons-kit'
import {Table, Divider, Button, Row, Col} from 'antd'
import {ic_pageview} from 'react-icons-kit/md/ic_pageview'
import {ic_access_time} from 'react-icons-kit/md/ic_access_time'
import {ic_done} from 'react-icons-kit/md/ic_done'
import {ic_date_range} from 'react-icons-kit/md/ic_date_range'
import {ic_loop} from 'react-icons-kit/md/ic_loop'
import {RepairDisplay} from './display_repair'
import NumberFormat from 'react-number-format'
import {getData} from '../../../../../../../network_requests/general'

export class RepairsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shuttle: props.shuttle,
            repairs: [],
            loadedRepair: '',
            problems: '',
            findings: '',
            modifications: '',
            outsourcedItems: '',
            items: []
        };

        this.columns = [{
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: record => {
                    if (record === 'NS') {
                        return (
                            <span>
                            <p style={{color: '#000000'}}>
                                <Icon icon={ic_access_time}
                                      size={24}
                                      style={{color: '#E9C46A', verticalAlign: 'middle'}}/>
                                </p>
                        </span>
                        )
                    } else if (record === 'IP') {
                        return (
                            <span><Icon icon={ic_loop} size={24}
                                        style={{color: '#E9C46A', verticalAlign: 'middle'}}/>
                                </span>
                        )
                    } else if (record === 'FO') {
                        return (
                            <span><Icon icon={ic_loop} size={24}
                                        style={{color: '#E9C46A', verticalAlign: 'middle'}}/>
                                </span>
                        )
                    } else if (record === 'FI') {
                        return (
                            <span><Icon icon={ic_pageview} size={24}
                                        style={{color: '#E9C46A', verticalAlign: 'middle'}}/>
                                </span>
                        )
                    } else if (record === 'SR') {
                        return (
                            <span><Icon icon={ic_date_range} size={24}
                                        style={{color: '#E9C46A', verticalAlign: 'middle'}}/>
                                </span>
                        )
                    } else if (record === "RO") {
                        return (
                            <span><Icon icon={ic_pageview} size={24}
                                        style={{color: '#E9C46A', verticalAlign: 'middle'}}/>
                                </span>
                        )
                    } else {
                        return (
                            <span> <Icon icon={ic_done}
                                         size={24}
                                         style={{color: '#42933C', verticalAlign: 'middle'}}
                            /></span>
                        )
                    }
                }
            }, {
            title: 'Date Requested',
            dataIndex: 'date_requested',
            key: 'date_requested',
            align: 'left',
        }, {
            title: 'Main Repair',
            dataIndex: 'category',
            key: 'category',
            align: 'left'
        }, {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            align: 'right',
            render: text => {
                return <NumberFormat value={text} displayType={'text'} thousandSeparator={true} prefix={'Php'}
                                         decimalScale={2} fixedDecimalScale={true}/>
            }
        }, {
                title: '',
                key: 'action',
                align: 'center',
                render: record => {
                    return (
                        <span> <Icon className='view-repair' icon={ic_pageview}
                                     onClick={() => this.loadNewRepair(record)}
                                     size={24}
                                     style={{cursor: 'pointer'}}/> </span>
                    )
                }
            }];

        this.loadNewRepair = this.loadNewRepair.bind(this)
    }

    componentDidMount() {
        this.fetchRepairs();

        getData('inventory/items')
            .then(data => {
                if (!data.error) {
                    this.setState({
                        items: data.items
                    })
                } else {
                    console.log(data.error)
                }
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
                outsourcedItems: data.outsourcedItems,
                loadedRepair: record
            }))
    };

    fetchRepairs() {
        const {shuttle} = this.state;
        console.log(shuttle.id);
        fetch('inventory/shuttles/repairs/' + shuttle.id)
            .then(response => response.json())
            .then(
                data => {
                    if (!data.error) {
                        this.setState({
                            repairs: data.repairs
                        })
                    } else {
                        console.log(data.error)
                    }
                })
    };

    render() {
        const {repairs, loadedRepair, problems, findings, modifications, outsourcedItems, items} = this.state;

        if (repairs.length === 0) {
            return (
                <div align='center'>
                    <br/>
                    <h2>This shuttle has no history of repairs</h2>
                </div>
            )
        } else {
            return (
                <div style={{paddingTop: 10}}>
                    <Row gutter={16}>
                        <Col span={10}>
                            <Table size={'small'} dataSource={repairs}
                                   columns={this.columns}
                                   loadNewRepair={this.loadNewRepair}/>
                        </Col>
                        <Col span={14}>
                            <RepairDisplay loadNewRepair={this.loadNewRepair}
                                           repair={loadedRepair}
                                           problems={problems}
                                           findings={findings}
                                           modifications={modifications}
                                           outsourcedItems={outsourcedItems}
                                           items={items}/>
                        </Col>
                    </Row>
                </div>
            )
        }
    }
}
