// need to add in case of self-signed certificate connection
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const express = require('express'); // use for mn data
const path = require('path');
// const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');// for json
const objectId = require('mongodb').ObjectID; // for allow objid

const multer = require('multer');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './assets/uploads/')
  },
  filename: function(req, file, cb) {
    if (file.mimetype === 'image/png') {
      cb(null, file.fieldname + '-' + new objectId + Date.now() + '.png');
    } else {
      cb(null, file.fieldname + '-' + new objectId + Date.now() + '.jpg');
    }
  }
})

const upload = multer({
  storage: storage,
  limits: {
    // 5 mb
    fileSize: 1024 * 1024 *5
  },
  fileFilter: fileFilter
});

var fs = require('fs'); // read sth file
var request = require("request");



var mgod = require('./schema.js');
// var sv = require('./db');



// const UserModel = require('./userSchema');


var app = express();

// Publish Folder
app.use('/assets/uploads', express.static('assets/uploads'));
app.use('/assets/images', express.static('assets/images'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create Server 203.150.243.251
const server = app.listen(5618,'127.0.0.1', function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Server is running.. at http://%s:%s", host, port);
  updateEventStatus();
  updateLimitDateEvent();
  // updateRunner();
});

// Alow client to access cross domain or ip-address
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-access-token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// app.get('/*', function(req, res, next){
//   res.set('Content-Type', 'application/json' || 'Content-Type', 'application/x-www-form-urlencoded');
//   next();
// });

/**
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 */

app.post("/addUser", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  mgod.OrganizModel.create(req.body, (error, result) => {
    if(error){
      return res.status(500).send(error);
    }
    res.send(result.result);
  });
});

app.post("/org/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  mgod.OrganizModel.findOne({ "username": username} )
  .populate()
  .lean()
  .exec(function (err, chackInfo) {
    if (err) return handleError(err);
    // console.log(JSON.stringify(chat));
    // data test username: gdasdkooooooooo password: 12122442125
    if(!chackInfo){
      // console.log("USER NOT FOUND")
      res.json({result: "ERROR!", data: "USER NOT FOUND!"});
    }else{
      console.log(chackInfo.pass)
      if(chackInfo.password != password ){
        // console.log("Wrong password")
        res.json({result: "ERROR!", data: "x PASSWORD!"});
      }else{
        // console.log("login success")
        res.json({result: "login success!", token: chackInfo._id});
      }
    }
  });
})

app.get("/getUser", (req, res) => {

  mgod.OrganizModel.find({}, (error, result) => {
    if(error){
      return res.status(500).send(error);
    }
    res.json({result: "sucess", data: result});
  });
});

app.get("/getUser/:id", (req, res) => {

  mgod.OrganizModel.findOne({ "_id": new objectId(req.params.id) }, (error, result) => {
    if(error){
      return res.status(500).send(error);
    }
    res.json({result: "sucess", data: result});
  });
});

// upload.single('fileBg')
var eventUpload = upload.fields([{ name: 'fileBg', maxCount: 1 }, { name: 'fileDigicoin', maxCount: 1 }])
app.post('/createEvent', eventUpload, function(req, res) {
  // console.log(req.files);
  console.log('-----------------------------------------------');
  // req.body.fileBg = req.file.path;
  req.body.fileBg = req.files['fileBg'][0].path;

  let genbib = generate(2);
  req.body.bibNumber = genbib;
  let fileDigicoin;

  if (req.files['fileDigicoin'] !== undefined && req.files['fileDigicoin'].length > 0) {

    console.log(req.files['fileDigicoin'].length);
    fileDigicoin = req.files['fileDigicoin'][0].path;

    mgod.EventModel.create(req.body, (error, result) => {
      if(error){
        return res.status(500).send(error);
      }
      result.awords.aDigiCoin.fileDigicoin = fileDigicoin

        result.save(function(err1){
          if(err1) return err1;

          console.log('Create Event Seccess!');
          // console.log(result);
          console.log('-----------------------------------------------');
        });

      res.status(200).json({result: result});

    });
  } else {
    // console.log(req.files['fileDigicoin']);
    mgod.EventModel.create(req.body, (error, result) => {
      if(error){
        return res.status(500).send(error);
      }

        result.save(function(err1){
          if(err1) return err1;

          console.log('Create Event Seccess!');
          // console.log(result);
          console.log('-----------------------------------------------');
        });

      res.status(200).json({result: result});

    });
  }


});

app.get("/getAllEvent", (req, res) => {

  updateEventStatus();
  updateLimitDateEvent();

  mgod.EventModel.find({})
  .lean()
  .sort({ date: 'DESC'})
  .exec(function (err, result) {
    if (err) return handleError(err);

    if (result){
      res.json({result: "success", events: result});
    }
  });
});

// Get all Event that darft.
app.get("/getDarftEvent", (req, res) => {

  updateEventStatus();
  updateLimitDateEvent();

  mgod.EventModel.find({ "status": "darft" })
  .lean()
  .sort({ date: 'asc'})
  .exec(function (err, result) {
    if (err) return handleError(err);

    // console.log(result.runnerEvent.length );
    if (result){
      res.json({result: "success", events: result});
    }
  });
});

// Get all Event that publish.
app.get("/getEvent", (req, res) => {

  updateEventStatus();
  updateLimitDateEvent();

  mgod.EventModel.find({ "status": "publish" })
  .lean()
  .sort({ date: 'asc'})
  .exec(function (err, result) {
    if (err) return handleError(err);

    // console.log(result.runnerEvent.length );
    if (result){
      res.json({result: "success", events: result});
    }
  });
});

app.get("/event/:id", (req, res) => {

  let id = new objectId(req.params.id);
  console.log(id);

  mgod.EventModel.findOne({ "_id": id }, (error, result) => {
    if(error){
      return res.status(500).send(error);
    }
    res.json({result: "sucess", event: result});
  });
});

app.get("/getStartEvent", (req, res) => {
  mgod.EventModel.find({ "status": "start" })
  .sort({ endDate: 'asc'})
  .populate()
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    // console.log(result.runnerEvent.length );
    if (result){
      res.json({result: "success", events: result});
      // res.json({result: "error", runnerEvent: "คุณยังไม่ได้เข้าร่วมงานวิ่งใด"});
    }
  });
});

app.get("/getEndEvent", (req, res) => {
  mgod.EventModel.find({ "status": "end" })
  .sort({ endDate: 'asc'})
  .populate()
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    if (result){
      res.json({result: "success", events: result});
    }
  });
});

app.post("/setPublish", (req, res) => {

  const event_id = req.body.event_id;

  mgod.EventModel.findOne({ "_id": event_id }, function(err, evstatus){
    if(err) return err;
    if(!evstatus){
      console.log("UPDATE STATUS ERROR");
    }


  console.log(evstatus);
    evstatus.status = 'publish';

    evstatus.save(function(err1){
      if(err1) return err1;
      // console.log(err1);

      console.log("success ", "eventId: ", evstatus._id, "status: ", evstatus.status );
      res.json({result: "success", eventId: evstatus._id, status: evstatus.status })
    });
  });

});


/**
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 */


app.post('/signUp', (req, res) => {

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  mgod.RunnerModel.findOne({ "email": email})
  .exec(function (err, chackInfo) {
    if (err) return handleError(err);
    if(!chackInfo){
      mgod.RunnerModel.create({"username": username, "email": email, "password": password}, function (err, result) {
        if (err) return handleError(err);

        res.json({result: "success", runners: {
          username: username,
          email: email
        }});
      });
     } else {
      res.json({result: "error", runners: "This email is already!"});
    }
  });
});

app.get("/runner", (req, res) => {

  mgod.RunnerModel.find({}, (error, result) => {
    if(error){
      return res.status(500).send(error);
    }
    res.json({result: "sucess", runners: result});
  });
});

app.get("/runner/:id", (req, res) => {

  let id = req.params.id;

  mgod.RunnerModel.findOne({ "_id": id })
  .populate()
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);
    res.json({runner: result});
  });
});

// Lognin for Runner
app.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body)
  mgod.RunnerModel.findOne({"username": username})
  .lean()
  .exec(function (err, chackInfo) {
    if (err) return handleError(err);
    // console.log(JSON.stringify(chat));
    // data test username: gdasdkooooooooo password: 12122442125
    if(!chackInfo){
      // console.log("USER NOT FOUND")
      res.json({result: "ERROR!", data: "USER NOT FOUND!"});
    }else{
      console.log(chackInfo.pass)
      if(chackInfo.password != password ){
        // console.log("Wrong password")
        res.json({result: "ERROR!", data: "PASSWORD NOT FOUND!"});
      }else{
        // console.log("login success")
        if(chackInfo.svtoken !== ''){
          res.json({result: "login success", token: chackInfo._id, name: chackInfo.username, profile: chackInfo.profile, svtoken: chackInfo.svtoken});
        } else {
          res.json({result: "login success", token: chackInfo._id, name: chackInfo.username, profile: chackInfo.profile});
        }

      }
    }
  });
});

// chackInfo before Join
app.post('/join', function(req, res) {

  const runner_id = req.body.runner_id;
  const event_id = req.body.event_id;
  const distance = req.body.distance;
  const price = req.body.price;
  const size = req.body.size;
  // const bib = req.body.bib;

  // console.log(req.body);

  mgod.JoinModel.findOne({"event_id": event_id, "runner_id": runner_id})
  .lean()
  .exec(function (err, chackInfo) {
    if (err) return handleError(err);
    if(!chackInfo){
      console.log("Can Join This Event");

      mgod.EventModel.findOne({"_id" : event_id})
      .lean()
      .exec(function (err, event) {
        if (err) return handleError(err);
        if (!event) {
          console.log('Error. Can not find this event.');
        } else {
          console.log('Event status: ', event.status);

          if (event.status === 'publish') {

            let headbib = event.bibNumber;
            let getppjoin = event.stat.join;
            let bib;

            if (getppjoin.toString().length === 1){
              let int = parseInt(getppjoin) + 1;
              console.log(int);
              let footbib = "000" + int.toString();
              console.log(footbib);
              bib = headbib + footbib;
            } else if (getppjoin.toString().length === 2) {
              let int = parseInt(getppjoin) + 1;
              console.log(int);
              let footbib = "00" + int.toString();
              console.log(footbib);
              bib = headbib + footbib;
            } else if (getppjoin.toString().length === 3) {
              let int = parseInt(getppjoin) + 1;
              console.log(int);
              let footbib = "0" + int.toString();
              console.log(footbib);
              bib = headbib + footbib;
            } else if (getppjoin.toString().length === 4) {
              let int = parseInt(getppjoin) + 1;
              console.log(int);
              let footbib = "" + int.toString();
              console.log(footbib);
              bib = headbib + footbib;
            } else {
              console.log('Error, can not support.');
            }

            console.log(bib);

            mgod.JoinModel.create({
              "event_id": event_id,
              "runner_id": runner_id,
              "distance": distance,
              "price": price,
              "size": size,
              "bib": bib
            }, function (err, result) {
              if (err) console.log(err);

              console.log("Save Event");
              res.json({result: "success", data: result});

              // Up date Stat:falseRun of Runner +1
              mgod.RunnerModel.findOne({"_id": runner_id}, function(err, rnstat){
                if(err) return err;
                if(!rnstat){
                  console.log("UPDATE STAT RUNNER ERROR");
                }
                // console.log(data);
                rnstat.stat.sumjoin = parseInt(rnstat.stat.sumjoin) + 1;

                rnstat.save(function(err1){
                  if(err1) return err1;
                  // console.log(err1);
                });
                console.log('Updated Status Runner Id ', rnstat._id, 'falseRun: ',rnstat.stat.sumjoin);
              });

            });

            // Update Join Stat for Event
            mgod.EventModel.findOne({
              "_id": event_id
            }, function (err, result) {
              if (err) console.log(err);

              // console.log("Stat Join ", result.stat.join);
              result.stat.join = parseInt(result.stat.join + 1);

              result.save(function(err1){
                if(err1) return err1;
                console.log(err1);
                console.log("Update Stat Join +1:", result.stat.join);
              });

            });
          } else if (event.status === 'start') {

            let headbib = event.bibNumber;
            let getppjoin = event.stat.join;
            let bib;

            if (getppjoin.toString().length === 1){
              let int = parseInt(getppjoin) + 1;
              console.log(int);
              let footbib = "000" + int.toString();
              console.log(footbib);
              bib = headbib + footbib;
            } else if (getppjoin.toString().length === 2) {
              let int = parseInt(getppjoin) + 1;
              console.log(int);
              let footbib = "00" + int.toString();
              console.log(footbib);
              bib = headbib + footbib;
            } else if (getppjoin.toString().length === 3) {
              let int = parseInt(getppjoin) + 1;
              console.log(int);
              let footbib = "0" + int.toString();
              console.log(footbib);
              bib = headbib + footbib;
            } else if (getppjoin.toString().length === 4) {
              let int = parseInt(getppjoin) + 1;
              console.log(int);
              let footbib = "" + int.toString();
              console.log(footbib);
              bib = headbib + footbib;
            } else {
              console.log('Error, can not support.');
            }

            console.log(bib);

            mgod.JoinModel.create({
              "event_id": event_id,
              "runner_id": runner_id,
              "distance": distance,
              "price": price,
              "size": size,
              "bib": bib,
              "stat.status" : "start"
            }, function (err, result) {
              if (err) console.log(err);

              console.log("Save Event");
              res.json({result: "success", data: result});

              // Up date Stat:falseRun of Runner +1
              mgod.RunnerModel.findOne({"_id": runner_id}, function(err, rnstat){
                if(err) return err;
                if(!rnstat){
                  console.log("UPDATE STAT RUNNER ERROR");
                }
                // console.log(data);
                rnstat.stat.sumjoin = parseInt(rnstat.stat.sumjoin) + 1;

                rnstat.save(function(err1){
                  if(err1) return err1;
                  // console.log(err1);
                });
                console.log('Updated Status Runner Id ', rnstat._id, 'falseRun: ',rnstat.stat.sumjoin);
              });

            });

            // Update Join Stat for Event
            mgod.EventModel.findOne({
              "_id": event_id
            }, function (err, result) {
              if (err) console.log(err);

              // console.log("Stat Join ", result.stat.join);
              result.stat.join = parseInt(result.stat.join + 1);

              result.save(function(err1){
                if(err1) return err1;
                console.log(err1);
                console.log("Update Stat Join +1:", result.stat.join);
              });

            });
          } else if (event.status === 'end') {
            console.log("This Event is the end.");
            res.json({result: "error", data: "This event is the end."});
          } else {
            console.log("Status error.");
            res.json({result: "error", data: "This event is not activated."});
          }
        }
      });


    } else {
        console.log("Can Not Join This Event")
        res.json({result: "error", data: "Can Not Join This Event"});
    }
  });
});

// // Join Event for Runner
// chackInfo before Join
app.post('/beforejoin', function(req, res) {

  const runner_id = req.body.runner_idc;
  const event_id = req.body.event_idc;

  // console.log(req.body);

  mgod.JoinModel.findOne({"event_id": event_id, "runner_id": runner_id})
  .populate()
  .lean()
  .exec(function (err, chackInfo) {
    if (err) return handleError(err);
    if(!chackInfo){
      console.log("Can Join This Event");
      res.json({result: "success", data: "Join Event Done: "});
    } else {
        console.log("Can Not Join This Event")
        res.json({result: "ERROR", data: "Can Not Join This Event"});
    }
  });
});


// กิจกรรมทั้งหมดที่นักวิ่งxx เข้าร่วม คือเริ่มอยู่
app.get("/runner-join/:id", (req, res) => {

  let id = req.params.id;

  mgod.JoinModel.find({ "runner_id": id, "stat.status": "start" })
  .populate("event_id")
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    // console.log(result.runnerEvent.length );
    if (result){
      res.json({result: "success", runnerEvent: result});
      // res.json({result: "error", runnerEvent: "คุณยังไม่ได้เข้าร่วมงานวิ่งใด"});
    }
  });
});

// กิจกรรมที่กำลังเริ่ม และนักวิ่งxx เข้าร่วม
app.get("/runner-joincom/:id", (req, res) => {

  let id = req.params.id;

  mgod.JoinModel.find({ "runner_id": id, "stat.status": "comming" })
  .populate("event_id")
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    // console.log(result.runnerEvent.length );
    if (result){
      res.json({result: "success", runnerEvent: result});
      // res.json({result: "error", runnerEvent: "คุณยังไม่ได้เข้าร่วมงานวิ่งใด"});
    }
  });
});

// กิจกรรมที่หมดเวลาหรือวิ่งครบระยะแล้ว และนักวิ่งxx เข้าร่วม
app.get("/runner-joinend/:id", (req, res) => {

  let id = req.params.id;

  mgod.JoinModel.find()
  .and([
    {"runner_id": id},
    { $or: [{"stat.status": "finished"},{"stat.status": "timeout"}]}
  ])
  .populate("event_id")
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    // console.log(result.runnerEvent.length );
    if (result){
      res.json({result: "success", runnerEvent: result});
      // res.json({result: "error", runnerEvent: "คุณยังไม่ได้เข้าร่วมงานวิ่งใด"});
    }
  });
});

/***
 * Thank to JohnnyHK for mongoose how to use || and &&
 * url: https://stackoverflow.com/questions/13272824/combine-two-or-queries-with-and-in-mongoose
*/

// like
app.post('/like', function(req, res) {

  const runner_id = req.body.runner_id;
  const event_id = req.body.event_id;

  // console.log('runner_id ', runner_id);
  // console.log('event_id ', event_id);

  mgod.FavorModel.findOne({"event_id": event_id, "runner_id": runner_id})
  .populate("event_id")
  .lean()
  .exec(function (err, chackInfo) {
    if (err) return handleError(err);

    // console.log(chackInfo.event_id);
    if(!chackInfo){
      // console.log("Like!");
      mgod.FavorModel.create({
        "event_id": event_id,
        "runner_id": runner_id
      }, function (err, result) {
        if (err) console.log(err);

        console.log("Like");
        res.json({result: "Like", data: "You like this event"});

      });
      mgod.EventModel.findOne({
        "_id": event_id
      }, function (err, result) {
        if (err) console.log(err);

        console.log("Stat Like ", result.stat.like);
        result.stat.like = parseInt(result.stat.like + 1);

        result.save(function(err1){
          if(err1) return err1;

          console.log("Update Stat Like +1:", result.stat.like);
        });

      });
    } else {
        mgod.FavorModel.findOneAndDelete({"event_id": event_id, "runner_id": runner_id})
        .exec(function (err, chackInfo) {
          if (err) return handleError(err);
          if(!chackInfo){
            console.log("error");
          } else {
            console.log("Unlike");
            res.json({result: "Unlike", data: "You unlike this event"});
          }
        });
        mgod.EventModel.findOne({
          "_id": event_id
        }, function (err, result) {
          if (err) console.log(err);

          console.log("Stat Like ", result.stat.like);
          result.stat.like = parseInt(result.stat.like - 1);
          result.save(function(err1){
            if(err1) return err1;

            console.log("Update Stat Like -1:", result.stat.like);
          });

        });
    }
  });
});

// // like
// chackInfo like
app.post('/beforelike', function(req, res) {

  const runner_id = req.body.runner_id;
  const event_id = req.body.event_id;

  // console.log(req.body);

  mgod.FavorModel.find({"runner_id": runner_id, "event_id": event_id})
  .populate()
  .lean()
  .exec(function (err, chackInfo) {
    if (err) return handleError(err);
    if(!chackInfo){
      console.log("nope");
      if (chackInfo.length < 0) {
        res.json({result: "error", color: "#ccc"});
      }
    } else {
      console.log("get data");
      if (chackInfo.length > 0) {
        res.json({result: "success", data: chackInfo, color: "tomato"});
      } else {
        res.json({result: "error", color: "#f1f1f1"});
      }
    }
  });
});

// กิจกรรมทั้งหมดที่นักวิ่งxx กด like
app.get("/favorite/:id", (req, res) => {

  let id = req.params.id;

  mgod.FavorModel.find({ "runner_id": id })
  .populate("event_id")
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);
    // ยังไม่ได้ชื่นชอบงานวิ่งใด

    if (!result) {
      res.json({result: "error", favor: 'non'});
    } else {
      res.json({result: "success", favor: result});
    }
  });
});

function generate(n) {
  var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if ( n > max ) {
          return generate(max) + generate(n - max);
  }

  max        = Math.pow(10, n+add);
  var min    = max/10; // Math.pow(10, n) basically
  var number = Math.floor( Math.random() * (max - min + 1) ) + min;

  // console.log(number);
  return ("" + number).substring(add);
}


function reqUserToken(code){ return function(callback, errback) {

  var options = { method: 'POST',
    url: 'https://www.strava.com/oauth/token',
    qs:
     { client_id: '30709',
       client_secret: '8d4ad3e10a3574986012294fc5740734758096ac',
       code: code,
       grant_type: 'authorization_code' },
    headers:
     { 'cache-control': 'no-cache',
        'Content-Type': 'application/json' } };

  request(options, function (err, req, res) {
    if (err) throw new Error(err);

    var response = {}
    try{
      response = JSON.parse(res)
    }catch(e){
      console.log("PARSE ERROR ",e)

    }

    callback(response)

  });
}}

function getActivity(bf,af,stvtk){ return function(callback, errback) {

  var options = { method: 'GET',
    url: 'https://www.strava.com/api/v3/athlete/activities',
    qs:
     {  before: bf,
        after: af,
        page: '1',
        per_page: '30' },
    headers:
     {  'cache-control': 'no-cache',
        // 'Content-Type': 'application/json',
        Authorization: 'Bearer ' + stvtk }
  };

  request(options, function (err, req, res) {
    if (err) throw new Error(err);

    var response = {}
    try{
      response = JSON.parse(res)
    }catch(e){
      console.log("PARSE ERROR ",e)

    }

    callback(response)

  });
}}

function getOneActivity(id, stvtk){ return function(callback, errback) {

  var options = { method: 'GET',
    url: 'https://www.strava.com/api/v3/activities/' + id,
    qs:
     {  include_all_efforts: '' },
    headers:
     {  'cache-control': 'no-cache',
        // 'Content-Type': 'application/json',
        Authorization: 'Bearer ' + stvtk }
  };

  request(options, function (err, req, res) {
    if (err) throw new Error(err);

    var response = {}
    try{
      response = JSON.parse(res)
    }catch(e){
      console.log("PARSE ERROR ",e)

    }

    callback(response)

  });
}}



app.put("/api", (req, res) => {
  // var code = '9e17f60bfc534b1501857243681541241e89524d';var body = JSON.parse(req.body)
  var code = req.body.code;
  var token = req.body.token;
  // console.log('coddddddddde ::::', req.body);
  // console.log('::::: token', token)
  // console.log('::::: allllllllllllllll :::::::', req)

  reqUserToken(code)(function(resp){
    //console.log(resp)
    // console.log(">>> access token ", resp.access_token)
    //var resp = (JSON.stringify(resp))
    // console.log(">>> access token 3 ", resp)
    // console.log('access_token-----***',resp);
    var access_token = resp.access_token;

    mgod.RunnerModel.findOne({"_id": token}, function(err, data){
      if(err) return err;
      if(!resp){
        console.log("GET TOKEN ERROR");
        callback(-1);
        return;
      }
      console.log(data.svtoken)
      data.svtoken = access_token;

      data.save(function(err1){
        if(err1) return err1;
        // console.log(err1);
        console.log("access_token")
        console.log('Updated Strava Token');
        res.json({"access_token": access_token});
      });

    });
  })
});

app.post("/actlist", (req, res) => {

  var stvtk = req.body.stvtk;
  var idjoin = req.body.idjoin;

  console.log(stvtk);
  console.log(idjoin);


  mgod.JoinModel.findOne({"_id": idjoin})
  .populate("event_id")
  .lean()
  .exec(function (err, info) {
    if (err) return handleError(err);
    // console.log(info);
    if(!info){
        console.log("Error data not found!");
        res.json('error');
    } else {

      bf = Math.floor(new Date(info.event_id.endDate).getTime()/1000);
      af = Math.floor(new Date(info.event_id.startDate).getTime()/1000);

      getActivity(bf,af,stvtk)(function(resp){
          // console.log(bf);
          // console.log(af);
        var activities = resp;
        // console.log(resp);

        if (resp.errors) {
          // console.log('error activities: ', resp.errors)
          res.json('error');
        } else {
          res.json({result: "success", activities: activities});
          console.log('success')
          // console.log(activities);
        }
      })
    }
  });
});

app.post("/setactses", (req, res) => {

  var sv_id = req.body.sv_id;
  var join_id = req.body.join_id;
  var stvtk = req.body.stvtk;

  console.log(sv_id);
  console.log(join_id);
  console.log(stvtk);

  // ในกรณีที่ต้องการให้ผู้ใช้สามารถส่งระยะวิ่งซ้ำๆ ใน event เดียวกันได้ไม่ต้อง find
  // ใช้ซ้ำแต่ต่างคนหรือต่าง event เดียวกันได้ find sv, join
  // ใช้ซ้าไม่ได้เลย find id
  mgod.SessionModel.findOne({"sv_id": sv_id, "join_id": join_id })
  .populate("join_id")
  .lean()
  .exec(function (err, info) {
    if (err) return handleError(err);
    console.log(info);
    if(!info){

      console.log("id data not found");

      getOneActivity(sv_id, stvtk)(function(resp){

        var activity = resp;
        // console.log(activity);

        if (resp.errors) {
          res.json('error');
        } else {

          var id = activity.id;
          var distance = activity.distance;

          mgod.SessionModel.create({
            "join_id": join_id,
            "sv_id": id,
            "distance": distance
          }, function (err, result) {
            if (err) console.log(err);

            console.log("Add session success...");
            // res.json({result: "success", data: "success" , event_complete: false});

            mgod.JoinModel.findOne({"_id": join_id}, function(err, data){
              if(err) return err;
              if(!data){
                console.log("JOIN EVENT ERROR");
              } else {
                console.log('Updating runner stat...');

                // Up date Stat:alldistance of Runner +dis
                mgod.RunnerModel.findOne({"_id": data.runner_id}, function(err, aldisstat){
                  if(err) return err;
                  if(!aldisstat){
                    console.log("UPDATE STAT RUNNER ERROR");
                  }
                  // console.log(data);
                  // เก็บเป็น เมตร
                  console.log(distance);
                  console.log(aldisstat.stat.rank);

                  aldisstat.stat.rank = aldisstat.stat.rank + distance;

                  aldisstat.save(function(err1){
                    if(err1) return err1;
                    // console.log(err1);

                    console.log('Updated Status Runner Id ', aldisstat._id, 'rank: ',aldisstat.stat.rank);
                  });

                });
              }
            });

            console.log('Find to update join...');

            mgod.SessionModel.find({"join_id": join_id })
            .lean()
            .exec(function (err, info) {
              if (err) return handleError(err);

              if (!info){
                console.log('Error data not found.');
              } else {
                console.log('loading data...');

                if (info.length > 0) {

                  // console.log(info[0].distance);
                  var distance = 0;
                  var round = 1;

                  for ( var i = 0; i < info.length; i ++){
                    // console.log(i+1, info[i].distance);
                    distance = distance + parseFloat(info[i].distance);
                    round = round + parseInt(i);
                    // console.log('sum', distance);
                  }

                  var dis = distance/1000;
                  var rounds = round;
                  console.log("Set accumulate ...");
                  // res.json({data: 'Session.', distance: dis, type: 'Km.'});

                  // Up date Status Join Event
                  mgod.JoinModel.findOne({"_id": join_id}, function(err, jdata){
                    if(err) return err;
                    if(!jdata){
                      console.log("ERROR!!! CAN NOT UPDATE STAT JOIN EVENT");
                    }
                    // console.log(jdata);
                    jdata.stat.accumulate = dis;
                    jdata.stat.round = rounds;

                    // console.log(jdata.stat.accumulate);
                    // console.log(jdata.stat.round);

                    jdata.save(function(err1){
                      if(err1) return err1;

                      console.log('Updated Session Join');
                    });

                    if (jdata.stat.accumulate >= jdata.distance ) {
                      jdata.stat.status = 'finished';
                      jdata.save(function(err1){
                        if(err1) return err1;
                        // console.log(err1);
                        console.log('ID Join:',jdata._id, ' Status:',jdata.stat.status);
                        console.log('Updated Status Join Event.');
                      });


                      // Up date Stat:finishRun of Runner +1
                      mgod.RunnerModel.findOne({"_id": jdata.runner_id}, function(err, rnstat){
                        if(err) return err;
                        if(!rnstat){
                          console.log("UPDATE STAT RUNNER ERROR");
                        }
                        // console.log(data);
                        rnstat.stat.finishRun = parseInt(rnstat.stat.finishRun) + 1;

                        rnstat.save(function(err1){
                          if(err1) return err1;
                          // console.log(err1);

                          console.log('Updated Status Runner Id ', rnstat._id, 'finishRun: ',rnstat.stat.finishRun);
                        });

                      });
                    }

                    // เช็คเมื่อ event complete
                    if( jdata.stat.status === 'finished') {
                      res.json({result: "success", data: jdata , event_complete: true});
                    } else {
                      res.json({result: "success", data: jdata , event_complete: false});
                    }

                  });

                } else {
                  console.log('Non Updated Session Join');
                  // res.json({data: 'Don\'t have any session.', distance: 0, type: 'm.'})
                }

              }
            });
          });
        }
      })
    } else {
      console.log("data found!");
      res.json('error');
    }
  });
});

app.post("/submitlist", (req, res) => {

  // var stvtk = req.body.stvtk;
  var idjoin = req.body.join_id;

  // console.log(req.body.join_id);
  console.log('join id: ', idjoin);


  mgod.SessionModel.find({"join_id": idjoin})
  .populate({
    path: 'join_id',
    populate: { path: 'event_id', model: 'events' },
  })
  .lean()
  .exec(function (err, info) {
    if (err) return handleError(err);
    // console.log(info);
    if(!info){
        console.log("Error data not found!");
        res.json('error');
    } else {
      console.log('Load session join...');
      res.json({result: "success", activities: info});
      console.log('Load session join success');
    }
  });
});

app.post("/getReward", (req, res) => {
  let event_id = req.body.event_id;
  // console.log(event_id);
  mgod.JoinModel.findOne({ "event_id": event_id })
  .populate("event_id")
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    if (result){
      res.json({result: "success", join: result});

    } else {
      res.json({result: "error", join: "Event not found!"});
    }
  });
});

app.post("/getAllReward", (req, res) => {
  let runner_id = req.body.runner_id;
  // console.log(runner_id);
  mgod.JoinModel.find({ "runner_id": runner_id, "stat.status": "finished" })
  .populate("event_id")
  // .where("'event_id.awords.aDigiCoin' !== undefined || 'event_id.awords.aDigiCoin.fileDigicoin': ''")
  // .or([{ 'event_id.awords.aDigiCoin' : undefined}, {'event_id.awords.aDigiCoin.fileDigicoin': ''}])
  // .limit(6)
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    if (result.length > 0){
      res.json({result: "success", reward: result});
    } else {
      res.json({result: "error", reward: "Reward not found!"});
    }
  });
});

app.post("/getDetailReward", (req, res) => {
  let event_id = req.body.event_id;
  // console.log(event_id);
  mgod.EventModel.findOne({ "_id": event_id })
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    if (result){
      res.json({result: "success", reward: result});

    } else {
      res.json({result: "error", reward: "Reward not found!"});
    }
  });
});

app.post("/getBib", (req, res) => {
  let join_id = req.body.join_id;
  // console.log(event_id);
  mgod.JoinModel.findOne({ "_id": join_id })
  .populate("event_id")
  .lean()
  .exec(function (err, result) {
    if (err) return handleError(err);

    if (result){
      res.json({result: "success", bib: result});

    } else {
      res.json({result: "error", bib: "Bib not found!"});
    }
  });
});

/**
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------
 */

function countdown(endtime){

  // Set the date we're counting down to
  var countDownDate = new Date("Jan 5, 2021 15:37:25").getTime();

  // Update the count down every 1 second
  var x = setInterval(function() {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);
}


// 24 hr = 86400 * 1000 s or 1000 * 60 * 60 * 24
// .getTime() return millisec?
// 'll Up Data Every 24 hr
var udev = setInterval(function() {
  updateEventStatus();
  updateLimitDateEvent();
}, 1000 * 60 * 60 * 24);

function updateLimitDateEvent() {
  mgod.EventModel.find({"status": "publish"}, (error, result) => {
    if(error){
      return error
    } else {
      if (result.length !== 0) {

        var now = new Date().getTime();

        for(var i = 0; i < result.length; i++) {

          start = new Date(result[i].startDate).getTime();

          var eventStart = start - now;

          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(eventStart / (1000 * 60 * 60 * 24));
          // var hours = Math.floor((eventStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          // var minutes = Math.floor((eventStart % (1000 * 60 * 60)) / (1000 * 60));
          // var seconds = Math.floor((eventStart % (1000 * 60)) / 1000);

          if (eventStart > 0) {
            result[i].limitdate = days;
          } else {
            result[i].limitdate = 'END';
          }

          result[i].save(function(err1){
            if(err1) return err1;
            // console.log(err1);
          });
          console.log('Updated Limitdate Event Id ', result[i]._id, 'limitdate Start: ',result[i].limitdate);

        };

      } else {
        console.log('Don\'t have any Event that Publish');
        clearInterval(udev);
      }
    }
  });

  mgod.EventModel.find({"status": "start"}, (error, result) => {
    if(error){
      return error
    } else {
      if (result.length !== 0) {

        var now = new Date().getTime();

        for(var i = 0; i < result.length; i++) {

          end = new Date(result[i].endDate).getTime();

          var eventOut = end - now;

          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(eventOut / (1000 * 60 * 60 * 24));
          // var hours = Math.floor((eventStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          // var minutes = Math.floor((eventStart % (1000 * 60 * 60)) / (1000 * 60));
          // var seconds = Math.floor((eventStart % (1000 * 60)) / 1000);

          if (eventOut > 0) {
            result[i].limitdate = days;
          } else {
            result[i].limitdate = 'END';
          }

          result[i].save(function(err1){
            if(err1) return err1;
            // console.log(err1);
          });
          console.log('Updated Limitdate Event Id ', result[i]._id, 'limitdate End: ',result[i].limitdate);

        };

      } else {
        console.log('Don\'t have any Event that Start');
        clearInterval(udev);
      }
    }
  });
}

// Update Event Status
function updateEventStatus() {
  mgod.EventModel.find({ $or: [{"status": "publish"}, {"status": "start"}]}, (error, result) => {
    if(error){
      return error
    } else {
      if (result.length !== 0) {

        var now = new Date().getTime();
        var start,end;

        for(var i = 0; i < result.length; i++) {

          start = new Date(result[i].startDate).getTime();
          end = new Date(result[i].endDate).getTime();

          var eventStart = start - now;
          var eventOut = end - now;

          if (eventOut < 0) {

            result[i].status = 'end';

            result[i].save(function(err1){
              if(err1) return err1;

            });
            console.log('Update Event Status Id:',result[i]._id,' is ', result[i].status);

            // Update Join when Event End.
            mgod.JoinModel.find({"event_id": result[i]._id}, function(err, data){
              if(err) return err;
              if(!data){
                console.log("JOIN EVENT ERROR");
              } else {
                if (data.length !== 0) {
                  var statusJoin;
                  for(var j = 0; j < data.length; j++) {

                    statusJoin = data[j].stat.status;

                    if (statusJoin !== 'finished') {
                      data[j].stat.status = 'timeout';
                      data[j].save(function(err1){
                        if(err1) return err1;
                        // console.log(err1);
                      });
                      console.log('Updated Status Idjoin:',data[j]._id, ' Status:',data[j].stat.status);

                      // Up date Stat:falseRun of Runner +1
                      mgod.RunnerModel.findOne({"_id": data[j].runner_id}, function(err, rnstat){
                        if(err) return err;
                        if(!rnstat){
                          console.log("UPDATE STAT RUNNER ERROR");
                        }
                        // console.log(data);
                        rnstat.stat.falseRun = parseInt(rnstat.stat.falseRun) + 1;

                        rnstat.save(function(err1){
                          if(err1) return err1;
                          // console.log(err1);
                        });
                        console.log('Updated Status Runner Id ', rnstat._id, 'falseRun: ',rnstat.stat.falseRun);
                      });
                    }
                  }
                } else {
                  console.log('Don\'t have Anyone Join this Event.');
                }
              }
            });
          } else {

            if (eventStart < 0) {

              result[i].status = 'start';

              result[i].save(function(err1){
                if(err1) return err1;

              });
              console.log('Update Event Status Id:',result[i]._id,' is ', result[i].status);

              // Update Join when Event Start.
              mgod.JoinModel.find({"event_id": result[i]._id}, function(err, data){
                if(err) return err;
                if(!data){
                  console.log("JOIN EVENT ERROR");
                } else {
                  if (data.length !== 0) {

                    for(var k = 0; k < data.length; k++) {

                      if (data[k].stat.status !== 'finished') {
                        data[k].stat.status = 'start';
                        data[k].save(function(err1){
                          if(err1) return err1;
                          // console.log(err1);
                        });
                        console.log('Updated Status Idjoin:',data[k]._id, ' Status:',data[k].stat.status);
                      } else {
                        console.log('Non Updated Status Idjoin:',data[k]._id, ' Status:',data[k].stat.status);
                      }



                    }
                  } else {
                    console.log('Don\'t have Anyone Join this Event.');
                  }
                }
              });
            } else {
              console.log('Non Data Update for Id:',result[i]._id);
            }
          }

        };

      } else {
        console.log('Don\'t have any Event that Publish');
        clearInterval(udev);
      }
    }
  });
}

/// make function to update somthing.
function updateRunner() {
  mgod.RunnerModel.find({}, function(err, rndata){
    if(err) return err;
    if(!rndata){
      console.log("UPDATE DATA of RUNNER ERROR");
    }

    if (rndata.length > 0) {
      for (var i = 0; i < rndata.length; i++) {
        rndata[i].profile = "assets\\images\\profile-vrunner-f01.jpg";

        rndata[i].save(function(err1){
          if(err1) return err1;
          // console.log(err1);
        });

        console.log('------------update data--------------');
      }
    } else {
      console.log('------------data error--------------');
    }
  });
}
