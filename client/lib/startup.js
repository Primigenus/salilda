BlazeLayout.setRoot('body');

Meteor.startup(function() {
  Session.setDefault("songFilter", "");
});
