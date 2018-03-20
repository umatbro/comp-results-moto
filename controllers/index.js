const q = require('../controllers/db-queer');

exports.index = function(req, res) {
    q.getRanking()
        .then((ranking) => {
            res.render('index', {
                title: 'Results',
                ranking: ranking,
            });
        }).catch((err) => res.render('error', {err}));
};
