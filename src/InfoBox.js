import React from 'react';
import {Card, CardContent, Typography} from '@material-ui/core';
import './infoBox.css';

function InfoBox(props) {
    return (
        <div>
            <Card onClick={props.onClick}
                    className={`infoBox ${props.active && "infoBox--selected"} 
                                        ${props.isRed && "infoBox--red"}`}
            >
                <CardContent>
                    <Typography className="infoBox__title" color="textSecondry">{props.title}</Typography>
                </CardContent>

                <h2 className={`infoBox__cases ${!props.isRed && "infoBox__cases--green"}`}>{props.cases}</h2>

                <Typography className="infoBox__total" color="textSecondary">
                    {props.total} Total
                </Typography>
            </Card>
        </div>
    )
}

export default InfoBox
