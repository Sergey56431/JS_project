import {Form} from "./components/form.js";
import {mainPage} from "./components/mainPage.js";
import {operations} from "./components/operations.js";
import {Auth} from "./services/auth.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('title');

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
                    // new Operations('operations');
                }
            },
            {
                route: '#/mainPage',
                title: 'Главная',
                template: 'templates/mainPage.html',
                styles: 'styles/mainPage.css',
                load: () => {
                    new mainPage();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/income.css',
                load: () => {
                    // new Income('income');
                }
            },
            {
                route: '#/consumption',
                title: 'Расходы',
                template: 'templates/consumption.html',
                styles: 'styles/income.css',
                load: () => {

                }
            },
            {
                route: '#/create',
                title: 'Создать операцию',
                template: 'templates/create.html',
                styles: 'styles/income.css',
                load: () => {

                }
            },
            {
                route: '#/change-operation',
                title: 'Редактировать операцию',
                template: 'templates/change-operation.html',
                styles: 'styles/addmoney.css',
                load: () => {

                }
            },
            {
                route: '#/addmoney',
                title: 'Создать операцию дохода',
                template: 'templates/addmoney.html',
                styles: 'styles/addmoney.css',
                load: () => {

                }
            },
            {
                route: '#/changemoney',
                title: 'Редактировать доход',
                template: 'templates/changemoney.html',
                styles: 'styles/addmoney.css',
                load: () => {

                }
            },
            {
                route: '#/changepay',
                title: 'Редактировать расход',
                template: 'templates/changepay.html',
                styles: 'styles/addmoney.css',
                load: () => {

                }
            },
            {
                route: '#/addpay',
                title: 'Создать операцию расход',
                template: 'templates/addpay.html',
                styles: 'styles/addmoney.css',
                load: () => {

                }
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash;
        console.log(urlRoute)

        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return false;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        })

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;
        newRoute.load();
    }
}