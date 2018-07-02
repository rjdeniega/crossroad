/**
 * Created by JasonDeniega on 27/06/2018.
 */

import React, {Component} from 'react';
import logo from '../../images/crossroad_logo.png'
import colors from '../../utilities/colorsFonts.css'
import {Icon} from 'react-icons-kit'
import {UsersPage, Page2} from '../../pages/users/users'
import {groupOutline} from 'react-icons-kit/typicons/groupOutline'
import {users} from 'react-icons-kit/feather/'
import {u1F46E} from 'react-icons-kit/noto_emoji_regular/u1F46E'
import {driversLicenseO} from 'react-icons-kit/fa/driversLicenseO'
import {cube} from 'react-icons-kit/fa/cube'
import {Avatar, List, Tag, Tabs} from 'antd'
import {userCircleO} from 'react-icons-kit/fa/userCircleO'
import {UserAvatar} from "../../components/avatar/avatar"
import {RemittanceNavBar} from './components/remittance_navigation/navigation'
import {money} from 'react-icons-kit/fa/money'
import {data} from '../../pages/users/users'
import './style.css'
import {RemittanceList} from './components/remittance_list/remittance_list'

const TabPane = Tabs.TabPane;
function callback(key) {
    console.log(key);
}
export class RemittancePage extends Component {
    render() {
        return (
            <div className="body-wrapper">
                <div className="remittance-page-wrapper">
                    <div className="remittance-page-body">
                        <div className="remittance-header">
                            <div className="header-text">
                                <Icon className="page-icon" icon={money} size={42}/>
                                <div className="page-title"> Remittances</div>
                                <div className="rem-page-description"> Manage Beep™ and ticketing remittances</div>
                            </div>
                            <UserAvatar/>
                            <div className="header-bottom">
                                <div className="user-tabs-wrapper">
                                    <Tabs className="user-tabs" defaultActiveKey="1" onChange={callback}>
                                        <TabPane className="tab-item" tab="Overview" key="1"></TabPane>
                                        <TabPane className="tab-item" tab="Ticketing" key="2"></TabPane>
                                        <TabPane className="tab-item" tab="Beep" key="3"></TabPane>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                        <div className="remittance-content-body">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}