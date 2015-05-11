FlowRouter.route('/', {
  subscriptions: function() {
    this.register('people', Meteor.subscribe('people'));
    this.register('songs', Meteor.subscribe('songs'));
  },
  action: function() {
    FlowLayout.render('layout', {body: 'home'});
  }
});

FlowRouter.route('/songs', {
  subscriptions: function() {
    this.register('songs', Meteor.subscribe('songs'));
  },
  action: function() {
    FlowLayout.render('layout', {body: 'songs'});
  }
});
FlowRouter.route('/song/:id',{
  subscriptions: function(params) {
    this.register('song', Meteor.subscribe('songs', params.id));
  },
  action: function() {
    FlowLayout.render('layout', {body: 'song'});
  }
})

FlowRouter.route('/people', {
  subscriptions: function() {
    this.register('people', Meteor.subscribe('people'));
  },
  action: function() {
    FlowLayout.render('layout', {body: 'people'});
  }
});
FlowRouter.route('/person/:id', {
  subscriptions: function(params) {
    this.register('person', Meteor.subscribe("people", params.id));
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
