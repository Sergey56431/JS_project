import {UrlManager} from '../utils/url-manager.js'
import {CustomHttp} from "../services/custom-http.js";
import Chart from "chart.js/auto";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";
import * as bootstrap from 'bootstrap'
import {Balance} from "./balance.js";

export class MainPage {
    constructor(page) {
        this.data = null;
        this.profileElement = document.getElementById('user');
        this.profileFulNameElement = document.getElementById('user-name');
        this.buttonAll = document.getElementById('btn-check-2-outlined-5')
        this.buttonWeek = document.getElementById('btn-check-2-outlined-2');
        this.buttonMonth = document.getElementById('btn-check-2-outlined-3');
        this.buttonYear = document.getElementById('btn-check-2-outlined-4');
        this.buttonToday = document.getElementById('btn-check-2-outlined-1');
        this.buttonInterval = document.getElementById('btn-check-2-outlined-6');
        this.buttonIntervalFrom = document.getElementById('date-begin');
        this.buttonIntervalTo = document.getElementById('date-over');
        this.incomeChart = document.getElementById("pieChart1");
        this.expensesChart = document.getElementById("pieChart2");
        this.expensesChartView = null;
        this.incomeChartView = null;

        UrlManager.getQueryParams();
        (() => {
            const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.forEach(tooltipTriggerEl => {
                new bootstrap.Tooltip(tooltipTriggerEl)
            })
        })()

        Balance.sending();
        this.init();
        this.showUser();
    }

    showUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            this.profileElement.style.display = 'flex';
            this.profileFulNameElement.innerText = userInfo.name + " " + userInfo.lastName;
        } else {
            this.profileElement.style.display = 'none';
        }
    }

    buildGraph(result) {
        let expenseArrAmount = [];
        let expenseArrCategory = [];
        let incomeArrAmount = [];
        let incomeArrCategory = [];
        result.forEach(item => {
            if (item.type === 'expense') {
                expenseArrAmount.push(item.amount)
                expenseArrCategory.push(item.category)
            }
            if (item.type === 'income') {
                incomeArrAmount.push(item.amount)
                incomeArrCategory.push(item.category)
            }
        })

        let incomeChartData = {
            labels: incomeArrCategory,
            datasets: [
                {
                    data: incomeArrAmount,
                    backgroundColor: [
                        "#DC3545",
                        "#FD7E14",
                        "#FFC107",
                        "#20C997",
                        "#0D6EFD",
                        "#FFC0CB",
                        "#00FFFF",
                        "#8B008B"
                    ]
                }]
        };

        this.incomeChartView = new Chart(this.incomeChart, {
            type: 'pie',
            data: incomeChartData
        });


        let expensesChartData = {
            labels: expenseArrCategory,
            datasets: [
                {
                    data: expenseArrAmount,
                    backgroundColor: [
                        "#DC3545",
                        "#FD7E14",
                        "#FFC107",
                        "#20C997",
                        "#0D6EFD",
                        "#FFC0CB",
                        "#00FFFF",
                        "#8B008B"
                    ]
                }]
        };

        this.expensesChartView = new Chart(this.expensesChart, {
            type: 'pie',
            data: expensesChartData
        });
    }

    async init() {

        const that = this;
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/login'
        }

        this.buttonToday.onclick = () => getOperation('today');
        this.buttonAll.onclick = () => getOperation('all');
        this.buttonYear.onclick = () => getOperation('year');
        this.buttonWeek.onclick = () => getOperation('week');
        this.buttonMonth.onclick = () => getOperation('month');

        async function getOperation (period) {
            try {
                const result = await CustomHttp.request(config.host + '/operations/?period=' + period);
                if (result) {
                    if (that.expensesChartView != null && that.incomeChartView != null) {
                        that.expensesChartView.destroy();
                        that.incomeChartView.destroy();
                    }
                    that.buildGraph(result)
                }
            } catch (error) {
                console.log(error);
            }
        }

        this.buttonInterval.onclick = async function () {

            let from = that.buttonIntervalFrom.value.split('.')
            let to = that.buttonIntervalTo.value.split('.')
            try {
                const result = await CustomHttp.request(config.host + '/operations/?period=interval&dateFrom=' + from + '&dateTo=' + to);
                if (result) {
                    if (that.expensesChartView != null && that.incomeChartView != null) {
                        that.expensesChartView.destroy();
                        that.incomeChartView.destroy();
                    }
                    that.buildGraph(result)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}

