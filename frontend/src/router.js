import {Form} from "./components/form.js";
import {MainPage} from "./components/mainPage.js";
import {Operations} from "./components/operations.js";
import {Auth} from "./services/auth.js";
import {Consumption} from "./components/consumption.js";
import {Create} from "./components/create.js";
import {ChangeOperation} from "./components/changeOperation.js";
import {Addmoney} from "./components/addmoney.js";
import {Changemoney} from "./components/changemoney.js";
import {Changepay} from "./components/changepay.js";
import {Addpay} from "./components/addpay.js";
import {Income} from "./components/income.js";

export class Router {
    constructor() {
        this.layout = document.getElementById('layout');
        this.sidebar = document.getElementById('sidebar');
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('title');
        this.pageSelector = document.querySelectorAll('a[href]');


        this.routes = [

            {
                route: '#/signup',
                title: 'Создайте аккаунт',
                template: 'templates/signup.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и Расходы',
                template: 'templates/operations.html',
                styles: 'styles/operations.css',
                load: () => {
                    new Operations('operations');
                }
            },
            {
                route: '#/mainPage',
                title: 'Главная',
                template: 'templates/mainPage.html',
                styles: 'styles/mainPage.css',
                load: () => {
                    new MainPage();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/income.css',
                load: () => {
                    new Income('income');
                }
            },
            {
                route: '#/consumption',
                title: 'Расходы',
                template: 'templates/consumption.html',
                styles: 'styles/income.css',
                load: () => {
                    new Consumption('consumption');
                }
            },
            {
                route: '#/create',
                title: 'Создать операцию',
                template: 'templates/create.html',
                styles: 'styles/income.css',
                load: () => {
                    new Create('create');
                }
            },
            {
                route: '#/change-operation',
                title: 'Редактировать операцию',
                template: 'templates/change-operation.html',
                styles: 'styles/addmoney.css',
                load: () => {
                    new ChangeOperation( 'changeOperation');
                }
            },
            {
                route: '#/addmoney',
                title: 'Создать операцию дохода',
                template: 'templates/addmoney.html',
                styles: 'styles/addmoney.css',
                load: () => {
                    new Addmoney('addmoney')
                }
            },
            {
                route: '#/changemoney',
                title: 'Редактировать доход',
                template: 'templates/changemoney.html',
                styles: 'styles/addmoney.css',
                load: () => {
                    new Changemoney('changemoney')
                }
            },
            {
                route: '#/changepay',
                title: 'Редактировать расход',
                template: 'templates/changepay.html',
                styles: 'styles/addmoney.css',
                load: () => {
                    new Changepay('changepay')
                }
            },
            {
                route: '#/addpay',
                title: 'Создать операцию расход',
                template: 'templates/addpay.html',
                styles: 'styles/addmoney.css',
                load: () => {
                    new Addpay( 'addpay')
                }
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash;

        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return false;
        }

        if (urlRoute !== '#/login' && urlRoute !== '#/signup') {
            this.sidebar.style.display = "block";
            this.layout.style.justifyContent = 'flex-start';
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        })

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        for (let i = 0; i < this.pageSelector.length; i++) {
            if (this.pageSelector[i].href.includes(urlRoute)){
                this.pageSelector[i].classList.add('active');
            }
            if(!this.pageSelector[i].href.includes(urlRoute)){
                this.pageSelector[i].classList.remove('active');
            }
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;
        newRoute.load();
    }
}