import React from "react";
import {format} from 'date-fns'
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {useParams, useNavigate, Link, useLocation} from "react-router-dom";
import ADPContainer from './ADPContainer.js';
import CNAContainer from './CNAContainer.js';
import GithubAPI from './GithubAPI';
import { Card, Tab, Nav, Alert, Button, InputGroup, Form, ListGroup } from "react-bootstrap";

/*https://raw.githubusercontent.com/cisagov/vulnrichment/develop/2024/30xxx/CVE-2024-30015.json*/

const githubapi = new GithubAPI();

const cve_regex=/CVE-(?<year>\d{4})-(?<id>\d{4,7})/

function App() {
    
    const { id } = useParams();
    const [recent, setRecent] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchVal, setSearchVal] = useState("");
    const [invalidCVE, setInvalidCVE] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("adp");
    const [doSearch, setDoSearch] = useState(false);


    useEffect(() => {

	if (doSearch) {
	    searchCVEs();
	    setDoSearch(false);
	}

    }, [doSearch]);
    

    useEffect(() => {

	if (id) {
	    setSearchVal(id);
	    setDoSearch(true);
	}
	
    }, [id]);

    
    useEffect(() => {

	let ss = JSON.parse(sessionStorage.getItem("cves")) || {};
        setRecent(ss)
	
	setError("Search for a CVE!");
	setLoading(false);

    }, [])


    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            searchCVEs();
        }
    }

    function validateCVE () {

	const found = searchVal.match(cve_regex);
	if (found) {
	    if (Object.keys(found.groups).length === 2) {
		return found;
	    }
	}
	return null;
    }


    const searchCVEs = async () => {
	setError(null);
	setLoading(true);
	//sessionStorage.removeItem("cves");
	const matches = validateCVE();
	if (matches) {
	    let ss = JSON.parse(sessionStorage.getItem("cves")) || {};
	    if (ss?.cves) {
		if (!ss.cves.includes(searchVal)) {
		    ss.cves.push(searchVal);
		}
	    } else {
		ss['cves'] = [searchVal]
	    }
	    sessionStorage.setItem("cves", JSON.stringify(ss));
	    setRecent(ss)
	    setInvalidCVE(false);
	    await githubapi.getOne(matches.groups.year, matches.groups.id).then((response) => {
		setData(response);
		setLoading(false);
	    }).catch((err) => {
		setLoading(false);
		setError("CVE has not been enriched by CISA");
		console.log(err);
	    });
	} else {
	    setLoading(false);
	    setError("Invalid CVE");
	    setInvalidCVE(true);
	}

    }

    return (
    <div className="App">
      <header className="App-header">
	  <h2>Vulnsight</h2>
      </header>
	<div className="App-body">
	    <div className={"cve-card " + (recent.cves?.length > 0 ? "d-flex align-items-start gap-2" : "" )}>
		<Card bg="light" className={"cve-search-card " + (recent.cves?.length > 0 ? "" : "w-100")}>
		<Card.Header>
		    <Form.Group>
		    <Form.Label>CVE Search</Form.Label>
		    <InputGroup className="mb-3">
			<Form.Control
			    placeholder="Search CVEs"
			    aria-label="Search CVEs"
			    aria-describedby="searchcves"
			    value={searchVal}
			    isInvalid={invalidCVE}
			    onChange={(e) =>
				setSearchVal(e.target.value)
			    }
			    name="searchcve"
			    onKeyPress={(e) => onKeyDown(e)}
			/>

			<Button
			    variant="btn btn-outline-secondary"
			    id="button-addon2"
			    onClick={(e) => searchCVEs()}
			>
			    <i className="fas fa-search"></i>
			</Button>
		    </InputGroup>
			{invalidCVE &&
			 <Form.Text className="error">Please enter a valid CVE</Form.Text>
			}
		    </Form.Group>
		</Card.Header>
		<Card.Body>
		    {loading ?

		     <div className="text-center">
			 <div className="loader">
			 </div>
		     </div>

		     :
		     <>
			 {error ?

			  <Alert variant="danger">{error}</Alert>
			  :
			  <>

			      <h3>{data.cveMetadata.cveId}</h3>
			      <h4>{data.containers?.cna?.title}</h4>

			      <p className="lead">This record was <a href={`https://cveawg.mitre.org/api/cve/${data.cveMetadata?.cveId}/`} target="_blank" rel="noreferrer" title="CVE JSON record">{data.cveMetadata?.state}</a> by <span className="fw-bold">{data.cveMetadata?.assignerShortName}</span> on {format(new Date(data.cveMetadata?.datePublished), 'yyyy-MM-dd')} and last updated on {format(new Date(data.cveMetadata?.dateUpdated), 'yyyy-MM-dd')}.</p>
			      <hr/>
			      

			 <Tab.Container
			     activeKey = {activeTab}
			     className="mb-3"
			     onSelect={(k) => setActiveTab(k)}
			 >
			     <Nav fill variant="pills" className="mb-3">
				 <Nav.Item key="adp">
				     <Nav.Link eventKey="adp">ADP (CISA)</Nav.Link>
				 </Nav.Item>
				 <Nav.Item key="cna">
				     <Nav.Link eventKey="cna">CNA ({data.cveMetadata.assignerShortName})</Nav.Link>
				 </Nav.Item>
			     </Nav>
			     <Tab.Content id="adp-fns" className="p-0">
				 <Tab.Pane eventKey="adp" key="adp">
				     {data.containers?.adp?.length > 0 ?
				      <>
					  {data.containers.adp.map((adp, index) => {
					      if (["CISA-ADP", "CISAADP"].includes(adp.providerMetadata.shortName)) {
						  return (
						      <ADPContainer
							  adp={adp}
						      />
						      
						  )
					      } else {
						  return ""
					      }
					  })}
				      </>
				      :
				      <h3>No ADP container available</h3>
				     }
				     
				 </Tab.Pane>
				 <Tab.Pane eventKey="cna" key="cna">

				     <CNAContainer
					 cna = {data.containers.cna}
				     />
				     
				 </Tab.Pane>
			     </Tab.Content>
			 </Tab.Container>
			  </>
			 }


			      
		     </>
		    }
		</Card.Body>
	    </Card>
	{recent.cves?.length > 0 &&
	 <Card className="viewed-card">
	     <Card.Header>
		 <div className="d-flex align-items-center justify-content-between">
		     <Card.Title>Recently Viewed</Card.Title>
		     <Button variant="icon" onClick={(e)=>(sessionStorage.removeItem("cves"), setRecent({}))}><i className="fas fa-trash"></i>
		     </Button>
		 </div>
	     </Card.Header>
	     <Card.Body>
		 <ListGroup variant="flush">
		     {recent.cves.toReversed().map((cve, idx) => (
			 <ListGroup.Item className="p-2" key={`recent-${idx}`}>
			     <Link to={`/${cve}`}>{cve}</Link>
			     {/*<a href="#" onClick={(e)=>(e.preventDefault(), setSearchVal(cve), setDoSearch(true))}>{cve}</a>*/}
			 </ListGroup.Item>
		     ))}
		 </ListGroup>
	     </Card.Body>
	 </Card>
	}
	    </div>
	</div>

    </div>
  );
}

export default App;
