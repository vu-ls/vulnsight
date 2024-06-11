import axios from 'axios';


export default class GithubAPI{

    constructor(url=null) {
	this.url = url
    }

    /*https://raw.githubusercontent.com/cisagov/vulnrichment/develop/2024/30xxx/CVE-2024-30015.json*/
    
    getOne(year, id) {
	let subdir = "";
	if (id.length == 4) {
	    subdir=`${id[0]}xxx`;
	} else {
	    subdir=`${id[0]}${id[1]}xxx`;
	}
	const url = `https://raw.githubusercontent.com/cisagov/vulnrichment/develop/${year}/${subdir}/CVE-${year}-${id}.json`;
	console.log(url);
	return axios.get(url).then(response => response.data);
	
    }
	

}
