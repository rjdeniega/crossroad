/**
 * Created by JasonDeniega on 05/07/2018.
 */
import React, {Component} from 'react';
import './style.css'
import emptyStateImage from '../../../../images/empty_state_construction.png'

export class ShiftManagementPane extends Component{
    render(){
        return(
             <div className="overview-tab-body">
                <img className="empty-image" src={emptyStateImage}/>
                <p className="empty-message">Area under construction</p>
            </div>
        )
    }
}