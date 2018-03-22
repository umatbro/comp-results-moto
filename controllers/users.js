const Contestant = require('../models/contestant');

exports.editUserController = async function(req, res) {
  return res.render(
    'user_edit',
    {user: await Contestant.findById(req.params.id)}
  );
};
