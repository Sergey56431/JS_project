import * as bootstrap from 'bootstrap';
import {Router} from './router.js';

class App {
    constructor() {
        this.router = new Router();
        document.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging()
    {
        this.router.openRoute();
    }
}

(new App());