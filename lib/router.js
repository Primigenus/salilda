FlowRouter.route('/', {
  subscriptions: function() {
    this.register('songCount', Meteor.subscribe('songCount'));
  },
  action: function() {
    FlowLayout.render('layout', {body: 'home'});
  }
});

FlowRouter.route('/songs', {
  subscriptions: function(params) {
    var page = params.query.page;
    this.register('songCount', Meteor.subscribe('songCount'));
    this.register('allSongs', Meteor.subscribe('songs', null, page, null));
  },
  action: function() {
    FlowLayout.render('layout', {body: 'songs'});
  }
});
FlowRouter.route('/song/:id',{
  subscriptions: function(params) {
    var self = this;
    this.register('song', Meteor.subscribe('song', params.id, function() {
      var song = Songs.findOne(params.id);
      if (song) {
        var allStaff = _.union(song.lyricists, song.composers, song.singers);
        self.register('peopleForSong', Meteor.subscribe('people', allStaff));
      }
    }));

  },
  action: function() {
    FlowLayout.render('layout', {body: 'song'});
  }
})

FlowRouter.route('/people', {
  subscriptions: function() {
    this.register('allPeople', Meteor.subscribe('people'));
  },
  action: function() {
    FlowLayout.render('layout', {body: 'people'});
  }
});
FlowRouter.route('/person/:id', {
  subscriptions: function(params) {
    this.register('person', Meteor.subscribe("person", params.id));
    this.register('songsByPerson', Meteor.subscribe('songsByPerson', params.id));
    console.log("songsByPerson", params.id);
  },
  action: function() {
    FlowLayout.render('layout', {body: 'person'});
  }
})

FlowRouter.route('/about', {
  action: function() {
    FlowLayout.render('layout', {body: 'about'});
  }
});
