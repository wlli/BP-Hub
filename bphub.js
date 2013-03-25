var measurement = new Meteor.Collection("measurement");
var notification = new Meteor.Collection("notification");
var phone = new Meteor.Collection("phone");
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
    return measurement.find({},  {sort:{year:-1,month:-1,day:-1,hour:-1,min:-1}, limit: 20}); //show 20 measurement data
  }

  //button click to send notification
  Template.notification.events = {
    "click #submit": function(event){
      event.preventDefault();
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

      //insert into DB collection: notification
      notification.insert({content : $('#note').val(), 
                         raw_time : currentTime.getTime(), 
                         time : readableTime});

      //submit to Google cloud messaging
      // to do here
      var device_id;
      var device_ids = phone.find({}, {sort:{time: -1}, limit: 1});// the latest record
      device_ids.forEach(function(entry){
          device_id = entry.device_id;
      });
      console.log(device_id);
      console.log("ha");
      //var device_id ="APA91bEC8dvG0OvPjLwLx7f6N_pGJ6x962DyHgkuGnEsEvHHjAxWseztZCrDjtBrorQJo31gd7NCmFQzDykp-tXQStmvoFrZOKjVzm_LcnkxsVrlPB2IWAP-z78U9G0tdvgX2vBcZuhPjMUJw7t-RSovO6gtOoK0Mg";
      Meteor.call('send_gcm',device_id,
                $('#note').val(), readableTime);


      //clear the text area
      document.getElementById("note").value = ""; // clear the text area
    }
  }

  Template.history.showHistory = function(){
    return notification.find({}, {sort: {raw_time: -1}, limit: 10}); //show 10 only
  }

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    send_gcm: function (device_id, content, timestamp) {
          this.unblock();
          var result = Meteor.http.call("GET", 
                "http://lwlfypla.appspot.com/send?deviceID="+device_id+"&content="+content+"&timeStamp="+timestamp);
         if(result.statusCode==200) {
            var respJson = JSON.parse(result.content);
            console.log("response received.");
         } else {
            throw new Meteor.Error(respJson.message.code, respJson.message.text);
         }
    }
  });
}
