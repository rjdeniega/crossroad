/**
 * Created by JasonDeniega on 29/05/2018.
 */
import React, {Component} from 'react';
import './style.css'
import logo from '../../images/crossroad_logo.png'
import {Icon} from 'react-icons-kit'
import {UsersPage,} from '../../pages/users/users'
import {users} from 'react-icons-kit/feather/'
import {u1F46E} from 'react-icons-kit/noto_emoji_regular/u1F46E'
import {driversLicenseO} from 'react-icons-kit/fa/driversLicenseO'
import {cube} from 'react-icons-kit/fa/cube'
import {userCircleO} from 'react-icons-kit/fa/userCircleO'
import {RemittancePage} from '../../pages/remittances/remittances'
import {InventoryPage} from '../../pages/inventory/inventory'
import {money} from 'react-icons-kit/fa/money'
import {BrowserRouter, Link, Redirect, Route, Switch, withRouter} from "react-router-dom";


//define tabs
const TABS = [
    {
        name: "Users",
        key: "users",
        path: '/users',
        component: UsersPage,
        image: userCircleO
    },
    {
        name: "Drivers",
        key: "drivers",
        path: '/drivers',
        component: RemittancePage,
        image: u1F46E
    },
    {
        name: "Remittances",
        key: "remittances",
        path: '/remittances',
        component: RemittancePage,
        image: money
    },
    {
        name: "Members",
        key: "members",
        path: '/members',
        component: RemittancePage,
        image: driversLicenseO
    },
    {
        name: "Inventory",
        key: "inventory",
        path: '/inventory',
        component: InventoryPage,
        image: cube
    },
];
export class NavBar extends Component {
    // function to append all NavBar items
    // get every item in tab array and transform it to a component
    //iterate from TABS array and attach the necessary items. OnCurrentPageChange is a props passed from app.js (app folder)
    //props came from TABS array
    // you can pass props like a function <NavBarItems name(parameter) = prop>, parameters are defined in
    // NavBarItem Class(see below line 68)
    renderNavbarItems = () => TABS.map(tab =>
            <Link key ={tab.key} className="tab-link" to={tab.path} component={tab.component}>
                <NavBarItems  name={tab.name}
                             icon={tab.image}/>
            </Link>
    );

    render() {
        return (
            //render logo and all items
            <div className="nav-container">
                <img className='logo' src={logo}/>
                <div className="nav-item-container">
                    {this.renderNavbarItems()}
                </div>
            </div>

        );
    }
}
class NavBarItems extends Component {
    render() {
        return (
            <div className="navbar-item" onClick={this.props.onClick}>
                <Icon icon={this.props.icon} size={25}/>
                <p className="icon-label"> {this.props.name} </p>
            </div>
        );
    }
}
export default withRouter(NavBar, NavBarItems);
