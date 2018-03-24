var fn = {
    list: function (req, res, next) {
        var no = req.query.pageNo;
        res.end('list page ' + no);
    }, // 객체 안에 함수 넣기
    view: function () {
        res.end('view');
    },
    delete: function () {

    }
};

module.exports = fn;