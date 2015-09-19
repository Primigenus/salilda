Template.home.helpers({
  numSongs: function() {
    var songCount = SongCount.findOne();
    if (songCount)
      return songCount.count;
  }
});
