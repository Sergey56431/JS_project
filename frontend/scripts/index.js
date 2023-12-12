import {UrlManager} from '../src/components/utils/url-manager.js'
import {CustomHttp} from "../src/components/services/custom-http.js";
// import Chart from "chart.js/auto";
import config from "../config/config.js";
import {Auth} from "../src/components/services/auth.js";

export class mainPage {
    constructor(){
        this.data = null;
        this.profileElement = document.getElementById('user');
        this.profileFulNameElement = document.getElementById('user-name');


        UrlManager.getQueryParams();
        (() => {
            const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.forEach(tooltipTriggerEl => {
                new bootstrap.Tooltip(tooltipTriggerEl)
            })
        })()
        this.init();
        this.showUser();
    }



    showUser(){
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if(accessToken){
            this.profileElement.style.display = 'flex';
            this.profileFulNameElement.innerText = userInfo.fullName;
        } else {
            this.profileElement.style.display = 'none';
        }
    }



    buildGraph(){
        const pieChart1 = document.getElementById('pieChart1');
        const pieChart2 = document.getElementById('pieChart2');
        let option = {responsive: true};
        new Chart (pieChart1, {
            type:'pie',
            options:option,
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [300, 50, 100,300, 50, 100],
                    backgroundColor: [
                        'rgb(255,1,1)',
                        'rgb(22,72,239)',
                        'rgb(255,201,0)',
                        'rgb(14,255,0)',
                        'rgb(238,0,255)',
                        'rgb(255,140,0)'
                    ],
                    hoverOffset: 4
                }]
            }
        });
        new Chart (pieChart2, {
            type:'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [300, 50, 100,300, 50, 100],
                    backgroundColor: [
                        'rgb(255,1,1)',
                        'rgb(22,72,239)',
                        'rgb(255,201,0)',
                        'rgb(14,255,0)',
                        'rgb(238,0,255)',
                        'rgb(255,140,0)'
                    ],
                    hoverOffset: 4
                }]
            }
        });
    }
    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/expense', 'GET')
            console.log(result)
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                //location.href = '#/choice';
                this.data = result
                this.buildGraph();
            }

        } catch (error) {
            console.error(error);
        }
    }
}
