Template.people.helpers({
  person: function() {
    return People.find({}, {sort: {name: 1}});
  },
  total: function() {
    return People.find().count();
  }
});
