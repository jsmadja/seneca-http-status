'use strict';

const Seneca = require('seneca');
const Express = require('express');
const Web = require('seneca-web');
const Routes = [
    {
        prefix: '/',
        pin: 'role:todo,cmd:*',
        map: {
            ok: {GET: true},
            ko: {GET: true}
        }
    }
];

const Plugin = function plugin() {
    this.add('role:todo,cmd:ok', (msg, done) => {
        done(null, {ok: true});
    });
    this.add('role:todo,cmd:ko', (msg, done) => {
        done(null, {
            http$: {status: 403},
            why: `It's not OK !`
        });
    });
};

const config = {
    routes: Routes,
    adapter: require('seneca-web-adapter-express'),
    context: Express()
};

const seneca = Seneca()
    .use(Plugin)
    .use(Web, config)
    .ready(() => {
        seneca
            .export('web/context')()
            .listen('4000', () => {
                console.log('server started on: 4000');
            });
    });