Template.person.helpers({
  person: function() {
    return People.findOne({_id: FlowRouter.getParam("id")});
  },
  song: function() {
    return Songs.find();
  }
});
