import axios from 'axios';
const API_URL = process.env.API_URL || 'https://api.github.com/cisagov/vulnrichment'


const cve_regex=/CVE-(?<year>\d{4})-(?<id>\d{4,7})/


export default class GithubAPI{

    constructor(file_dir=null, url=null) {
	this.file_dir = file_dir;
	this.url = url
    }

    getAll() {
	let url = this.file_dir;
	return axios.get(url).then(response => response.data);

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
