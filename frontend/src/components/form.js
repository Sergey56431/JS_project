import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";


export class Form {

    constructor(page) {
        this.layout = document.getElementById('layout');
        this.sidebar = document.getElementById('sidebar');
        this.rememberMe = false;
        this.processElement = null;
        this.page = page;
        this.fullName = null;
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if(accessToken){
            location.href = '#/mainPage';
            return;
        }

        this.sidebar.style.display = "none";
        this.layout.style.justifyContent = 'center';

        this.fields = [

            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                regex: /^[А-Я][а-я]+\s+[А-Я][а-я]+\s*$/,
                valid: false,
            });
            this.fields.unshift({
                name: 'passwordRepeat',
                id: 'passwordRepeat',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            });
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });
        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {

        let password = document.getElementById('password');
        let repeatFeedback1 = document.getElementById('invalid-repeat');
        let repeatFeedback2 = document.getElementById('invalid-value');


        if (!element.value || !element.value.match(field.regex)) {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            if (element.id === 'passwordRepeat' && !element.value) repeatFeedback1.style.display = 'none';
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
            field.valid = true;
        }
        if (element.id === 'passwordRepeat' && !element.value) {
            repeatFeedback1.style.display = 'none';
            repeatFeedback2.style.display = 'block';
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
            field.valid = false;
        }
        if (element.id === 'passwordRepeat' && element.value !== password.value && element.value) {
            repeatFeedback1.style.display = 'block';
            repeatFeedback2.style.display = 'none';
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
            field.valid = false;
        }
        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid)
        this.rememberMe = document.getElementById('remember').value;
        if (this.page === 'signup')
            this.fullName = document.getElementById('fullName').value.split(' ');
        this.rememberMe === 'checked' ? this.rememberMe = true : this.rememberMe =false;
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            if (this.page === 'signup') {

                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        email: email,
                        lastName: this.fullName[1],//this.fields.find(item => item.name === 'name').element.value,
                        name: this.fullName[0],//this.fields.find(item => item.name === 'fullName').element.value,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat').element.value,
                    })

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                        sessionStorage.setItem('user', JSON.stringify(result.user));
                        //location.href = '#/mainPage';
                    }

                } catch (error) {
                    console.error(error);
                }
            }
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,//this.fields.find(item => item.name === 'email').element.value,
                    password: password,
                    rememberMe: this.rememberMe//this.fields.find(item => item.name === 'password').element.value,
                })

                if (result) {
                    if (result.error || !result.tokens.accessToken ||
                        !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        id: result.user.id,
                        email: result.user.email
                    });
                    location.href = '#/mainPage';
                    // this.sidebar.style.display = "flex";
                    // this.layout.style.justifyContent = 'flex-start';
                }

            } catch (error) {
                console.error(error);
            }

        }
    }
}
