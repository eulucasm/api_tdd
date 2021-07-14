const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';

let user;
let user2;

//beforeAll = executa a ação antes de todos os testes
//beforeEach = executa a ação antes de cada teste
//afterAll = executa a ação depois de todos os testes
//afterEach = executa a ação depois de cada teste

beforeEach(async () => {
    const res = await app.services.user.save({
        name: 'User Account',
        mail: `${Date.now()}@mail.com`,
        passwd: '123456'
    });
    user = {
        ...res[0]
    };
    user.token = jwt.encode(user, 'Segredo!');

    const res2 = await app.services.user.save({
        name: 'User Account 2',
        mail: `${Date.now()}@mail.com`,
        passwd: '123456'
    });
    user2 = {
        ...res2[0]
    };
});

test('Deve inserir uma conta com sucesso', () => {
    return request(app).post(MAIN_ROUTE)
        .send({
            name: 'Acc #1'
        })
        .set('authorization', `bearer ${user.token}`)
        .then((result) => {
            expect(result.status).toBe(201);
            expect(result.body.name).toBe('Acc #1');
        });
});

test('Não deve inserir uma conta sem nome', () => {
    return request(app).post(MAIN_ROUTE)
        .send({})
        .set('authorization', `bearer ${user.token}`)
        .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error).toBe('Nome é um atributo obrigatório');
        });
});

test.skip('Não deve inserir uma conta de nome duplicado para o mesmo usuário', () => {});

test('Deve listar apenas as contas do usuário', () => {
    return app.db('accounts').insert([{
            name: 'Acc User #1',
            user_id: user.id
        },
        {
            name: 'Acc User #2',
            user_id: user2.id
        },
    ]).then(() => request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Acc User #1');
        }));
});


test('Deve retornar uma conta por Id', () => {
    return app.db('accounts')
        .insert({
            name: 'Acc By Id',
            user_id: user.id
        }, ['id'])
        .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
            .set('authorization', `bearer ${user.token}`))
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Acc By Id');
            expect(res.body.user_id).toBe(user.id);
        });

});

test.skip('Não deve retornar uma consta de outro usuário', () => {});


test('Deve alterar uma conta', () => {
    return app.db('accounts')
        .insert({
            name: 'Acc By Update',
            user_id: user.id
        }, ['id'])
        .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`).send({
            name: 'Acc Updated'
        }).set('authorization', `bearer ${user.token}`))
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Acc Updated');
        });
});

test.skip('Não deve alterar uma consta de outro usuário', () => {});

test('Deve Remover uma conta', () => {
    return app.db('accounts')
        .insert({
            name: 'Acc to remove',
            user_id: user.id
        }, ['id'])
        .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
            .set('authorization', `bearer ${user.token}`))
        .then((res) => {
            expect(res.status).toBe(204);
        });
});

test.skip('Não deve remover uma consta de outro usuário', () => {});