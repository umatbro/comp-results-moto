const q = require('./db-queries');

exports.index = function(req, res) {
    q.getRanking()
        .then((ranking) => {
            res.render('index', {
                title: 'Ranking',
                ranking: ranking,
            });
        }).catch((err) => res.render('error', {err}));
};
