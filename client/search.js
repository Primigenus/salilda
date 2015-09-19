var setSongFilterThrottled = _.throttle(function(evt) {
  var value = evt.target.value;
  Session.set("songFilter", value);
}, 300);

Template.search.events({
  'keyup #search input': setSongFilterThrottled
});

Template.search.helpers({
  currentFilter: function() {
    return Session.get("songFilter");
  }
});
