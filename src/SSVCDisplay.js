import React from 'react';
import {Badge, Table} from 'react-bootstrap';
import { format } from 'date-fns';

const SSVCDisplay = ({content}) => {


    return (

	<div className="mb-3">
	    <div className="mb-2">
		<b>SSVC ({content.role} {content.version}):</b>
	    </div>
	    <Table>
		<tbody>
	    {content.options.map((decision, idx) => {
		return Object.keys(decision).map((d, index) => {
		    return (
			<tr key={`dec-${index}`}>
			    <td>{d}</td><td><Badge bg="primary">{decision[d]}</Badge></td>
			</tr>
		)
		})})}
		</tbody>
	    </Table>
	    <b>SSVC Date Assessed</b>:{" "}{format(new Date(content.timestamp), 'yyyy-MM-dd')}
	</div>
    )
}


export default SSVCDisplay;
