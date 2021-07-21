const express = require('express');

module.exports = (app) => {
    const router = express.Router();

    // GET /transfers
    router.get('/', (req, res, next) => {
        app.services.transfer.find({
                user_id: req.user.id
            })
            .then(result => res.status(200).json(result))
            .catch(err => next(err));
    });

    // POST /transfers
    router.post('/', (req, res, next) => {
        const transfer = {
            ...req.body,
            user_id: req.user.id
        };
        app.services.transfer.save(transfer)
            .then(result => res.status(201).json(result[0]))
            .catch(err => next(err));
    });

    router.get('/:id', (req, res, next) => {
        app.services.transfer.findOne({
                id: req.params.id
            })
            .then(result => res.status(200).json(result))
            .catch(err => next(err));
    });

    return router;
};