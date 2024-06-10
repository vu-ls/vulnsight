import React from 'react';
import {Badge} from 'react-bootstrap';
import CVSSSeverityBadge from './CVSSSeverityBadge.js';

const CNAContainer = ({cna}) => {




    return (
	<div className="cna-container">

	    {cna.descriptions?.length > 0 && (
	    <div className="mb-3"><b>Description:</b><br/>
		{cna.descriptions.map((d, index) => (
		    <p className="lead" key={`d-${index}`}>{d.value}</p>
		))}
	    </div>
	    )}
            {cna.problemTypes?.length > 0 && (
		<div><b>Problem Types:</b>
                    <ul className="list-unstyled">
                        {cna.problemTypes.map((t, index) => (
			    t.descriptions.map((d, idx) => (
				<li key={`pt-${index}-${idx}`}><Badge variant="primary">{d.cweId}</Badge>{" "}{d.description}</li>
                            )
					      )
			))}
		    </ul>
		</div>
	    )}
	    {cna.metrics?.length > 0 &&
             <div>
                 {cna.metrics.map((cvss, index) => {
                     return Object.keys(cvss).map(key => {
                         if (key.startsWith("cvss")) {
                             return (
                                 <div key={`metrics-${key}`} className="mb-3">
                                     <div className="mb-2"><b>CVSS Version {cvss[key]?.version || "3.x"}:</b></div>
                                     <div><b>Vector:</b> {cvss[key]?.vectorString}</div>
                                     <div><b>Base Score</b>: {cvss[key]?.baseScore}</div>
                                     {cvss[key]?.baseSeverity &&
                                      <div><b>Severity</b>: <CVSSSeverityBadge
                                                                severity = {cvss[key]?.baseSeverity}
                                                            />

                                      </div>
                                     }
                                 </div>
                             )
                         }
			 else {
			     return ""
			 }
                     })
                 })}
             </div>
	    }
	    {cna.references?.length > 0 && (
                <div><b>References:</b>
                    <ul className="list-unstyled">
                        {cna.references.map((t, index) => {
		            return (
                                <li key={`ref-${index}`}><a href={`${t.url}`} rel="noreferrer" target="_blank">{t.url}</a></li>
                            )
                        })}
                    </ul>
                </div>
	    )}

	    {cna.credits?.length > 0 &&
             <div><b>Credits:</b>
                 <ul className="list-unstyled">
                     {cna.credits.map((t, index) => {
                         return (
                             <li key={`credit-${index}`}>{t.value} {t.type && `(${t.type})`}</li>
                         )
                     })}
                 </ul>
             </div>
            }

	    {cna.affected?.length > 0 &&
	     <div className="modal-table">
                 <div className="mb-2"><b>Affected Products:</b></div>
		 
                 <table className="table">
                     <thead>
                         <tr>
                             <th>Product</th>
                             <th>Vendor</th>
                             <th>Version</th>
                             <th>Status</th>
                         </tr>
                     </thead>
		     <tbody>
                         {cna.affected?.length > 0 ? (
                             cna.affected.map((t, index) => {
                                 return (
                                     t.versions ?
                                         <React.Fragment key={`affected-${index}`}>
                                             {t.versions.map((v, ind) => {
                                                 return (
                                                     <tr key={`affectedprod-${index}-${ind}`}>
                                                         <td><span className="fw-semibold">{t.product ? `${t.product}` : `${t.packageName}`}</span>
							     {t.cpes?.length > 0 && (
								 <div>
								 {t.cpes.map((cpe, idx) => (
                                                                     <React.Fragment key={`cpe-${ind}-${idx}`}>{cpe}<br/>
								     </React.Fragment>
								 ))}
								 </div>
                                                             )}
                                                         </td>
							 
							 <td>{t.vendor ? `${t.vendor}` : <a href={`${t.collectionURL}`} rel="noreferrer" target="_blank">{t.collectionURL}</a>}</td>
                                                         <td>{v.version} {v.lessThan ?
                                                                          `< ${v.lessThan}`
                                                                         :
                                                                          <>
                                                                              {v.lessThanEqualTo &&
                                                                               `<= ${v.lessThanEqualTo}`
                                                                              }
                                                                          </>
                                                                         }
                                                         </td>
                                                         <td>{v.status}</td>
                                                     </tr>
                                                 )
                                             })}
					 </React.Fragment>
                                    :
                                    <React.Fragment key={`affected=${index}`}>
                                        <tr>
                                            <td>{t.product ? `${t.product}` : `${t.packageName}`}
                                                {t.cpes?.length > 0 && <br/>}
                                                {t.cpes?.map((cpe, idx) => (
                                                    <span className="fw-bolder" key={`cpe${index}-${idx}`}>{cpe}</span>
                                                ))}
                                            </td>
					    <td>{t.vendor ? `${t.vendor}` : <a href={`${t.collectionURL}`} rel="noreferrer" target="_blank">{t.collectionURL}</a>}
                                            </td>
                                            <td>{t.lessThan ?
                                                 `< ${t.lessThan}`
                                                 :
                                                 <>
                                                     {t.lessThanEqualTo &&
                                                      `<= ${t.lessThanEqualTo}`
                                                     }
                                                 </>
                                                }</td>
                                            <td>{t.defaultStatus}</td>
                                        </tr>
                                    </React.Fragment>
				)
                            })
                        ) :
                         <tr><td colSpan="4">No Products Defined</td></tr>
			 
			 
                        }
                    </tbody>
                </table>
	     </div>
	    }
	</div>
    )

}


export default CNAContainer;
