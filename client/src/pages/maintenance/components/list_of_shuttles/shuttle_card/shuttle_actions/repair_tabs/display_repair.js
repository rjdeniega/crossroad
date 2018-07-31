import React, {Component} from 'react'

export class RepairDisplay extends Component{
    constructor(props){
        super(props);
        this.state = {
            problems: null,
            findings: null,
            modifications: null
        }
    }


    componentDidMount(){
        const repair = this.props.loadedRepair
        console.log(repair)
        if(typeof repair !== 'undefined'){
            fetch('inventory/shuttles/repairs/specific/' + repair.id)
                .then(response => {
                    return response;
                })
                .then(response => response.json())
                .then(data => console.log(data))
        }

    }

    render(){
        let repair = this.props.loadedRepair
        if(typeof repair === 'undefined'){
            return(
                <div>heee</div>
            )
        } else {
            return(
                <div> awow </div>
            )
        }

    }
}