var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
var db = 'mongodb+srv://admin:tuananh0203@cluster0.f00xz.mongodb.net/mydata?retryWrites=true&w=majority'
const mongoose = require('mongoose');
mongoose.connect(db).catch(err => {
    console.log("xảy ra lỗi " + err)
});
router.get('/asia', function (req, res, next) {
    var name = 'TuanAnh'
    var age = '20'

    var array = [6, 54, 4, 4, 5, 6, 3, 34, 5, 4, 3]
    var student = {name: "TuanAnh", sdt: '0986328720'}

    var list = [
        {name: "TuanAnh", sdt: '0986328720'},
        {name: "TuanAnh", sdt: '0986328720'},
        {name: "TuanAnh", sdt: '0986328720'},
        {name: "TuanAnh", sdt: '0986328720'},
        {name: "TuanAnh", sdt: '0986328720'}
    ]
    var info = {
        name: 'LuongVanTuanAnh', sdt: '0986',
        list: [
            {name: "TuanAnh", sdt: '0986328720'},
            {name: "TuanAnh", sdt: '0986328720'},
            {name: "TuanAnh", sdt: '0986328720'},
            {name: "TuanAnh", sdt: '0986328720'},
            {name: "TuanAnh", sdt: '0986328720'}
        ]
    }

    res.render('category', {
        name: name,
        age: age,
        array: array,
        student: student,
        list: list,
        info: info,
        title: 'Asia',
        image: 'https://www.teahub.io/photos/full/316-3163801_asia-hd-wallpapers-free-download-unique-hdq-photos.png'
    });
});
router.get('/euro', function (req, res, next) {
    res.render('category', {title: 'Euro', image: 'https://www.nationsonline.org/maps/countries-europe-map-2018.jpg'});
});
router.get('/american', function (req, res, next) {
    res.render('category', {title: 'America', image: 'https://wallpapercave.com/wp/72EfVE2.gif'});
});
router.get('/about', function (req, res, next) {
    fs.readFile('luutru/' + 'data.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const text = data;
        const myArr = JSON.parse(text)
        res.render('about', {title: 'About', message: "", arr: myArr});
        console.log(data);
    })
});
var fs = require('fs')
const {request} = require("express");
router.post('/hotro', function (request, reponse) {
    var email = request.body.email;
    var sdt = request.body.sdt;
    var noidung = request.body.noidung;
    fs.appendFile('luutru/' + 'thongtin.txt', "Email :" + email + "\n" + "Phone :" + sdt + "\n" + "Nội dung :" + noidung + '\n', function (error) {
        var message = ''
        if (error) {
            message = error
        } else {
            message = "OK, chúng tôi đã nhận phản hồi"
        }
        reponse.render('about', {title: 'ok', message: message})
    })
});
router.get('/all', function (req, res) {
    Car.find({}, function (err, data) {
        res.render("all", {data: data})
    })
});
router.get('/listCar', function (req, res, next) {
    res.render('cars', {title: ''});
});
var carSchema = new mongoose.Schema({
    tenAnh: 'string',
    noiDung: 'string',
    linkAnh: 'string'
})
var Car = mongoose.model('car', carSchema);
router.post('/addCar', function (req, res) {
    var tenAnh = req.body.tenAnh;
    var noiDung = req.body.noiDung;
    var linkAnh = req.body.linkAnh;
    const car = new Car({
        tenAnh: tenAnh,
        noiDung: noiDung,
        linkAnh: linkAnh
    })
    car.save(function (err) {
        if (err) {
            mes = 'Thêm thành công'
        } else {
            mes = err
        }
        console.log(tenAnh + noiDung + linkAnh);
        res.render("cars")
    })

    // Car.updateOne({id:'623ed30ce431890f1cf413b1'},function (err){
    //
    // })

})
router.post('/them', function (req, res) {
    var tenAnh = req.body.tenAnh;
    var noiDung = req.body.noiDung;
    var linkAnh = req.body.linkAnh;
    const car = new Car({
        tenAnh: tenAnh,
        noiDung: noiDung,
        linkAnh: linkAnh
    })
    car.save(function (err) {
        res.send({
            title:err.mes,
            mes:'thành công'
        })
    })

    // Car.updateOne({id:'623ed30ce431890f1cf413b1'},function (err){
    //
    // })

})
router.post("/delete", function (req, res) {
    Car.deleteOne({_id: req.body.id})
        .then(result => {
            res.redirect('/all');
        })
        .catch(err => console.log(err))
})
// router.get('/update', function (req, res, next) {
//     res.render('update', {title: ''});
// });
router.post("/update", function (req, res) {
    Car.findById({_id: req.body.id}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.render("update", {data: data});
        }
    })
})
router.post("/updateCar", function (req, res) {
    Car.updateOne({_id: req.body.id}, req.body)
        .then(() => {
            res.redirect("/all")
        })
        .catch(err => console.log(err));
})
var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === "image/jpeg") {
            cb(null, 'uploads/');
        }
    },
    filename: function (req, file, cb) {
        // var random = Math.random();
        // cb(null, random + Date.now() + file.originalname);
        cb(null, Date.now() + ".jpg");
    },
});

var upload = multer({
    storage: storage, limits: {
        // tùy chọn max size cho file
        fileSize: 2 * 1024 * 1024
    }
}).array('avatar', 5);
router.get('/upload', function (req, res, next) {
    res.render('upload', {title: ''});
});
router.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.render('upload', {title: err.title});
        } else {
            res.render('upload', {title: 'tải thành công'});
        }
    })
});
router.get('/getAll', function (req, res) {
    Car.find({}, function (err, data) {
        res.send(data)
    })
});
module.exports = router;
