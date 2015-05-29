
Meteor.startup(function() {
  Session.setDefault("songFilter", "");
});

Template.registerHelper("subsReady", function(){
  return FlowRouter.subsReady();
});

var searchOnceEvery300ms = _.throttle(function(evt) {
  var value = evt.target.value;
  Session.set("songFilter", value);
}, 300);

Template.search.events({
  'keyup #search input': searchOnceEvery300ms
});

Template.search.helpers({
  currentFilter: function() {
    return Session.get("songFilter");
  }
});

Template.home.helpers({
  numSongs: function() {
    var songCount = SongCount.findOne()
    if (songCount)
      return songCount.count;
  }
});

Template.songs.onCreated(function() {
  this.sortBy = new ReactiveVar("title");
  this.sortOrder = new ReactiveVar(1);

  var curPage = parseInt(FlowRouter.getQueryParam("page")) || 1;
  this.currentPage = new ReactiveVar(curPage);
})

Template.songs.events({
  'click thead th': function(evt, template) {
    var el = $(evt.target);
    if (el.is("th")) el = el.find("span");
    var value = el.text().toLowerCase();
    template.sortOrder.set(template.sortOrder.get() * -1);
    template.sortBy.set(value);
  },
  'click .next': function(evt, template) {
    template.currentPage.set(template.currentPage.get() + 1);
  },
  'click .prev': function(evt, template) {
    var prevPage = Math.max(1, template.currentPage.get() - 1);
    template.currentPage.set(prevPage);
  }
});

Template.songs.helpers({
  nextPage: function() {
    var totalSongs = SongCount.findOne().count;
    var curSongs;

    var curPage = Template.instance().currentPage.get();
    if (curPage > 1) {
      var prevSongs = 50 * (curPage - 1);
      curSongs = prevSongs + Songs.find().count();
    } else {
      curSongs = 50;
    }

    if (curSongs < totalSongs)
      return curPage + 1;
  },
  prevPage: function() {
    var curPage = Template.instance().currentPage.get();
    if (curPage > 1)
      return Math.max(1, curPage - 1);
  },
  totalNumSongs: function() {
    var songCount = SongCount.findOne()
    if (songCount)
      return songCount.count;
  },
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
    var curPage = Template.instance().currentPage.get();
    if (curPage > 1) {
      var start = 50 * (Template.instance().currentPage.get() - 1);
      var end = start + Songs.find().count();
      return start + " - " + end;
    }
    return "1 - 50";
  },
  year: function() {
    return this.year || "--";
  }
});

Template.song.helpers({
  song: function() {
    return Songs.findOne();
  },
  lyricists: function() {
    if (People.findOne())
      return _.map(this.lyricists, function(id) {
        return {_id: id, name: People.findOne(id).name};
      });
  },
  singers: function() {
    if (People.findOne())
      return _.map(this.singers, function(id) {
        return {_id: id, name: People.findOne(id).name};
      });
  },
  composers: function() {
    if (People.findOne())
      return _.map(this.composers, function(id) {
        return {_id: id, name: People.findOne(id).name};
      });
  }
});

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
  },
  song: function() {
    return Songs.find();
  }
})
