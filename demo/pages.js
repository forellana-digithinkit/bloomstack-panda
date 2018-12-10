import { HTML, Component } from '../src/index';
import $ from 'jquery';

import homeTpl from './templates/home.handlebars';
import page1Tpl from './templates/page1.handlebars';
import page2Tpl from './templates/page2.handlebars';

export class Home extends Component {
    requiredComponents = [
        HTML
    ]

    name = "home";
    template = homeTpl;
}

export class Page1 extends HTML {
    name = "page-1";
    template = page1Tpl;
}

export class Page2 extends HTML {
    name = "page-2";
    template = page2Tpl;
}