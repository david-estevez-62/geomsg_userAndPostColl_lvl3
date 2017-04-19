var Message = require('../models/messages.js');

var indexController = {
  index: function(req, res) {

  		res.render('index', {
  			user: req.user
  		});
    
  },

  msgs: function(req, res){

		  	var geoJSONpoint = {
		      "type": "Point",
		      "coordinates": [
		           parseFloat(req.user.location.coordinates[0]),
		           parseFloat(req.user.location.coordinates[1])
		       ]
		    }

  	      Message.find({ "location.coordinates": {"$nearSphere": { "$geometry": geoJSONpoint, "$maxDistance": 8000 } }} , function(err, data){
              // if (err) return handleErr(err);
              res.send(data)

          });

  }
};

module.exports = indexController;