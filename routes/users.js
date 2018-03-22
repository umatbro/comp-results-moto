const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/:id/edit', usersController.editUserController);

module.exports = router;
