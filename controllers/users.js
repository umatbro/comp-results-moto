const q = require('../controllers/db-queries');

exports.editUserController = async function(req, res) {
  return res.render(
    'user_edit',
    {user: await q.getSingleUserDetails(req.params.id)}
  );
};
