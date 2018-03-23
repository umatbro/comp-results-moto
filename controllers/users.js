const q = require('../controllers/db-queries');

exports.editUserController = async function(req, res) {
  let user = await q.getSingleUserDetails(req.params.id);
  return res.render(
    'user_edit',
    {user: user}
  );
};
