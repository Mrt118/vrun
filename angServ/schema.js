const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://rwdbmrt:db1212312121@mrtnotmrt-k2q1b.gcp.mongodb.net/vrun-mgdb?retryWrites=true" , {useNewUrlParser: true});
var db = mongoose.connection;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

  mongoose.connection.on('connected', function(){
    console.log("Mongoose Connected")
  });

  mongoose.connection.on('error', function(error){
    console.log("Mongoose error",error)
  });
  mongoose.connection.on('disconnected', function(){
    console.log("Mongoose disconnected")
  });

var ogzSchema = mongoose.Schema({
  // _id: Schema.Types.ObjectId,
  username: {type: String, require: true},
  password: {type: String, require: true},
  email: String,
  status: Boolean,
  ogz_data: {
    name: String,
    logo: String,
    bg: String,
    description: String
  },
  user_data: {
    name: String,
    idCard: String,
    license: String,
    address: {
      address: String,
      zipCode: String
    },
    tel: String,
    fax: String
  },
  payment_data: {
    bank: String,
    brunh: String,
    nameAcc: String,
    accNumber: String
  },
  data: { type: Date, default: Date.now }
},{collection : "organizers", versionKey: false});

var rnSchema = mongoose.Schema({
  username: {type: String, require: true},
  password: {type: String, require: true},
  profile: {type: String, default: "assets\\images\\profile-vrunner-f01.jpg"},
  fullname: String,
  birthday: Date,
  address: String,
  email: String,
  stat: {
    rank: { type: Number, default: 0 },
    sumjoin: { type: Number, default: 0 },
    finishRun: { type: Number, default: 0 },
    falseRun: { type: Number, default: 0 }
  },
  date: { type: Date, default: Date.now },
  svtoken: String,
},{collection : "runners", versionKey: false});

var eventSchema = mongoose.Schema({
  ogz_id: { type: String, ref: "organizers" },
  eventName: String,
  description: String,
  startDate: Date,
  endDate: Date,
  goldofrun: String,
  distances: {
    distance: String,
    price: Number
  },
  runTime: String,
  fileBg: String,
  detailEvent: String,
  detailJoin: String,
  detailAward: String,
  awords: {
    aDigiCoin: {
      fileDigicoin: String,
      name: String,
      description: String
    },
    aShirt: String,
    aSizeShirt: String,
    aCup: String,
    aCoin: String,
    aMoney: String
  },
  deliveryPrice: Number,
  status: { type: String, default: 'darft' },
  limitdate: String,
  limitjoin: { type: Number, default: 0},
  bibNumber: String,
  stat: {
    view: { type: Number, default: 0},
    rate: { type: Number, default: 0},
    like: { type: Number, default: 0},
    join: { type: Number, default: 0}
  },
  date: { type: Date, default: Date.now }
},{collection : "events", versionKey: false});

var joinSchema = mongoose.Schema({
  event_id: { type: String, ref: "events" },
  runner_id: String,
  distance: String,
  price: String,
  size: String,
  bib: String,
  stat: {
    accumulate: { type: Number, default: 0},
    round: { type: Number, default: 0},
    status: { type: String, default: 'comming'}
  },
  date: { type: Date, default: Date.now }
},{collection : "joins", versionKey: false});

var favSchema = mongoose.Schema({
  runner_id: String,
  event_id: { type: String, ref: "events" }
},{collection : "favorite", versionKey: false});

var sessionSchema = mongoose.Schema({
  join_id: { type: String, ref: "joins"},
  sv_id: { type: String, ref: "runners"},
  distance: String,
  date: { type: Date, default: Date.now }
},{collection : "session", versionKey: false});

// var rewardsSchema = mongoose.Schema({
//   runner_id: { type: String, ref: "runners"},
//   event_id: { type: String, ref: "events"},
//   reward: String,
//   date: { type: Date, default: Date.now }
// },{collection: "rewards", versionKey: false});

var OrganizModel = mongoose.model('organizers', ogzSchema);
var RunnerModel = mongoose.model('runners', rnSchema);
var EventModel = mongoose.model('events', eventSchema);
var JoinModel = mongoose.model('joins', joinSchema);
var FavorModel = mongoose.model('favorite', favSchema);
var SessionModel = mongoose.model('session', sessionSchema);
// var RewardModel = mongoose.model('rewards', rewardsSchema);

module.exports.OrganizModel = OrganizModel;
module.exports.RunnerModel = RunnerModel;
module.exports.EventModel = EventModel;
module.exports.JoinModel = JoinModel;
module.exports.FavorModel = FavorModel;
module.exports.SessionModel = SessionModel;
// module.exports.RewardModel = RewardModel;
module.exports.db = db;

