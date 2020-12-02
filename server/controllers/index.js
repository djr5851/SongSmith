module.exports.Account = require('./Account.js');
module.exports.Song = require('./Song.js');

const notFoundPage = (req, res) => {
    res.render('notFound');
};
  