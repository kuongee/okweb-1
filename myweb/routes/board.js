var express = require('express');
var router = express.Router();
<<<<<<< HEAD

=======
>>>>>>> 7ea098f2cd82b3ad5cbebe9acd3e8a5ab150bd01
var fn = require('./common/fn');

router.get('/', fn.list);

module.exports = router;