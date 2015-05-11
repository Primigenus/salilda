
Meteor.startup(function() {
  Session.setDefault("songFilter", "");
})

var searchOnceEvery300ms = _.throttle(function(evt) {
  var value = evt.target.value;
  if (!value || value.length > 3)
    Session.set("songFilter", value);
}, 300);

Template.search.events({
  'keyup #search input': searchOnceEvery300ms
});

Template.search.helpers({
  currentFilter: function() {
    return Session.get("songFilter");
  }
})

Template.songs.onCreated(function() {
  this.sortBy = new ReactiveVar("title");
  this.sortOrder = new ReactiveVar(1);
})

Template.songs.events({
  'click thead th': function(evt, template) {
    var el = $(evt.target);
    if (el.is("th")) el = el.find("span");
    var value = el.text().toLowerCase();
    template.sortOrder.set(template.sortOrder.get() * -1);
    template.sortBy.set(value);
  }
})

Template.songs.helpers({
  song: function() {
    var filter = Session.get("songFilter");
    var selector = {};
    if (filter) {
      var regex = new RegExp(filter, "i");
      selector = {title: regex};
    }
    var sort = {}
    sort[Template.instance().sortBy.get()] = Template.instance().sortOrder.get();
    return Songs.find(selector, {sort: sort});
  },
  sortingBy: function(name) {
    var sortBy = Template.instance().sortBy.get();
    var sortOrder = Template.instance().sortOrder.get();
    if (sortBy == name)
      return sortOrder == 1 ? "&uarr;" : "&darr;";
  },
  total: function() {
    return Songs.find().count();
  }
});

Template.song.helpers({
  song: function() {
    return Songs.findOne();
  }
})

Template.people.helpers({
  person: function() {
    return People.find({}, {sort: {name: 1}});
  },
  total: function() {
    return People.find().count();
  }
});

Template.person.helpers({
  person: function() {
    return People.findOne();
  }
})
