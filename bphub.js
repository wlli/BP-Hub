var measurement = new Meteor.Collection("measurement");
var notification = new Meteor.Collection("notification");
if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "You can find the uploaded blood pressure data in the table below.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.bpdata.dataArr = function(){
    return measurement.find({},  {sort:{year:-1,month:-1,day:-1,hour:-1,min:-1}});
  }
  Template.bpdata.row_outstand = function(systolic, diastolic){
  }

  Template.notification.events = {
    "click #submit": function(event){
      //sumit to server
      console.log("submit notifications to server");
      //var ctn = document.getElementById("#note").value;
      var currentTime = new Date();
      var month = currentTime.getMonth() + 1;
      var day = currentTime.getDate();
      var year = currentTime.getFullYear();
      var hours = currentTime.getHours();
      var minutes = currentTime.getMinutes();
      var readableTime = month + "/" + day + "/" + year+" "+hours +":" + minutes;
      console.log(readableTime);
      notification.insert({content : $('#note').val(), 
                          raw_time : currentTime.getTime(), 
                          time : readableTime});

      //submit to Google cloud messaging
      // to do here

      document.getElementById("note").value = ""; // clear the text area
    }
  }

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
