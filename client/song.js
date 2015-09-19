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
