import React from 'react';
import { format } from 'date-fns';
import {Alert, Row, Col} from 'react-bootstrap';
import CNAContainer from './CNAContainer.js';
import SSVCDisplay from './SSVCDisplay.js';


const ADPContainer = ({adp}) => {


    return (
	<div className="adp-container">  
	    <p className="lead fw-bold">CISA last enriched this file on {format(new Date(adp.providerMetadata?.dateUpdated), 'yyyy-MM-dd')}.</p>
	    {adp.metrics.length > 0 && (
	     adp.metrics.map((metric, idx) => {
		    if ("other" in metric) {
			if (metric.other.type === "ssvc") {
			    return (
				<Row key={`ssvc-${idx}`}>
				    <Col lg={6} sm={12}>
					
					<SSVCDisplay
					    content={metric.other.content}
					/>
				    </Col>
				</Row>
			    )
			} else if (metric.other.type === "kev") {
			    return (
				<Alert variant="danger" key={`kev-${idx}`}>
				    <p>This vulnerability was added to the KEV on {metric.other.content.dateAdded}
				    </p>
				    <p>
					<b>Reference:</b>{" "}<a href={`${metric.other.content.reference}`} target="_blank" rel="noreferrer">{metric.other.content.reference}</a>
				    </p>
				</Alert>
			    )
			} else {
			    return <React.Fragment key={`spec-${idx}`}></React.Fragment>
			}
		    } else {
			return <React.Fragment key={`spec-${idx}`}></React.Fragment>
		    }
	     }))}
	    
	    {/*this gets all the standard fields */}
	    <CNAContainer
		cna={adp}
	    />
	    
	</div>
    )

}


export default ADPContainer;
