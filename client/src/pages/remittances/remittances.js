/**
 * Created by JasonDeniega on 27/06/2018.
 */

import React, {Component} from 'react';
import './style.css'
import logo from '../../images/crossroad_logo.png'
import colors from '../../utilities/colorsFonts.css'
import {Icon} from 'react-icons-kit'
import {UsersPage, Page2} from '../../pages/users/users'
import {groupOutline} from 'react-icons-kit/typicons/groupOutline'
import {users} from 'react-icons-kit/feather/'
import {u1F46E} from 'react-icons-kit/noto_emoji_regular/u1F46E'
import {driversLicenseO} from 'react-icons-kit/fa/driversLicenseO'
import {cube} from 'react-icons-kit/fa/cube'
import {userCircleO} from 'react-icons-kit/fa/userCircleO'
import './style.css'
import {RemittanceNavBar} from './components/remittance_navigation/navigation'

export class RemittancePage extends Component {
    render() {
        return (
            <div className="body-wrapper">
                <RemittanceNavBar/>
            </div>
        );
    }

}