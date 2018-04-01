const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/:id/edit', usersController.editUserController);
router.get('/new', usersController.addNewUserForm);

module.exports = router;
