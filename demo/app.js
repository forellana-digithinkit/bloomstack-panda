import WebApp, { ChildToggle } from '../src/index';
import $ from 'jquery';

import './style.less';
import appTpl from './templates/app.handlebars';

import { Home, Page1, Page2 } from './pages';

export default class DemoApp extends WebApp {

    template = appTpl

    async onInit() {
        await super.onInit();

        this.addChild([Home, Page1, Page2], {
            enabled: false,
            selector: () => $(this.selector).find('.content:first')
        });
    }

    async onAppStart() {
        this.togglePage('home');
    }

}