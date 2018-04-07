var fn = {
    list: function (req, res, next) {
        var no = req.query.pageNo;
        res.end('list page ' + no);
<<<<<<< HEAD
    }, // 객체 안에 함수 넣기
    view: function () {
        res.end('view');
    },
    delete: function () {

    }
};

module.exports = fn;
=======
    },
    view: function () {

    },
    delete: function () { }

};


module.exports = fn;
>>>>>>> 7ea098f2cd82b3ad5cbebe9acd3e8a5ab150bd01
