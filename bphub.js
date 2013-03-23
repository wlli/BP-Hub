var measurement = new Meteor.Collection("measurement");
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

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
