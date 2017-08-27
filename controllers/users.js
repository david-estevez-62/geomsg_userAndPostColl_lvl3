var User = require('../models/users.js');
var Message = require('../models/messages.js');



var userController = {


      locate: function (req, res) {
          var data = req.body;
          

          var date = new Date();
          var username = req.user.username;
          

          User.findOne({username:username}, function(err, user) {
            if (err) return handleErr(err);


            find = {
              coordinates: [data.lat, data.lng],
              datetime: date
            };

            user.location = find;
            user.save();

          });

          res.send('OK');

      },

      explore: function(req, res){

        var geoJSONpoint = {
            "type": "Point",
            "coordinates": [
                 parseFloat(req.user.location.coordinates[0]),
                 parseFloat(req.user.location.coordinates[1])
             ]
        };
        // Add datetime to query
        Message.find({}).populate("postedBy").exec(function(err, data){
          res.send(data);
        })
        // Message
        //   .find({ "location.coordinates": {"$nearSphere": { "$geometry": geoJSONpoint, "$maxDistance": 80000 }} })
        //   .populate("postedBy")
        //   .exec(function(err, msgs) {

        //   })

      },

      addMsg: function(req, res) {
        var imgFile;

        if(req.body.imgurl){
            imgFile = req.body.imgurl;
        } else if(req.file){
            imgFile = "/img/uploads/"+req.file.filename;
        }


        var newMsg = new Message({
            datetime: new Date(),
            expiresBy: new Date(),
            postedBy: req.user._id,
            contents: {
              imgFile: imgFile || '',
              imgFileDescrip: req.body.imgdescrip || '',
              text: req.body.content
            },
            location: {
              coordinates: [req.body.latcoord, req.body.lngcoord]
            }
        });

        newMsg.save(function(err, data){
          res.send(data);
        })

      }

      
}


module.exports = userController;