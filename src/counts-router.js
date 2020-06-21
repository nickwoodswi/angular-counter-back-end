const path = require('path')
const express = require('express')
const xss = require('xss')
const CountsService = require('./counts-service')

const countsRouter = express.Router()
const jsonParser = express.json()

const serializeCount = count => ({
    id: xss(count.id),
    name: xss(count.name),
    count: xss(count.count),
    sub_date: xss(count.sub_date)
})

countsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        CountsService.getCounts(knexInstance)
            .then(counts => {
                res.json(counts.map(serializeCount))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {id, name, count, sub_date} = req.body
        const newCount = {id, name, count, sub_date}
        CountsService.insertCount(req.app.get('db'), newCount)
            .then(count => {
                res
                .status(201)
                .location(path.posix.join(req.originalUrl))
                .json(serializeCount(count))
            })
            .catch(next)
    })

countsRouter
    .route('/:id')
    .delete((req, res, next) => {
        CountsService.deleteCount(
          req.app.get('db'),
          req.params.id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { name, count } = req.body
        const id = req.params.id
        CountsService.updateCount(knexInstance, id, {name, count})
            .then(count => {
                res.json(serializeCount(count))
            })
            .catch(next)
    })

module.exports = countsRouter