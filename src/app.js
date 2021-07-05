const app = require('express')();
const consign = require('consign');
const knex = require('knex');
//const knexLogger = require('knex-logger');
const knexfile = require('../knexfile');

//TODO criar chaveamento dinâmico
app.db = knex(knexfile.test);

//app.use(knexLogger(app.db));

consign({
        cwd: 'src',
        verbose: true
    })
    .include('./config/middlewares.js')
    .then('./services')
    .then('./routes')
    .then('./config/routes.js')
    .into(app);

app.get('/', (req, res) => {
    res.status(200).send();

});

//PARA IDENTIFICAR ERROS RELACIONADOS A DB
// app.db.on('query', (query) => {
//         console.log({
//             sql: query.sql,
//             bindings: query.bindings ? query.bindings.join(',') : ''
//         });
//     })
//     .on('query-response', response => console.log(response))
//     .on('error', error => console.log(error));

module.exports = app;