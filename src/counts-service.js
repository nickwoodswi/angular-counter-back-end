const CountsService = {

    getCounts(knex) {
        return knex.select('*').from('counts')
    },

    insertCount(knex, count) {
        return knex
            .insert(count)
            .into('counts')
            .returning('*')
            .then(rows => {
            return rows[0]
      })
    },

    deleteCount(knex, id) {
        return knex('counts')
          .where({ id })
          .delete()
    },

    updateCount(knex, id, updates) {
        return knex('counts')
            .where({ id })
            .update(updates)
    }
}

module.exports = CountsService