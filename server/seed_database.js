Meteor.methods({
  empty: function() {
    Songs.remove({});
    People.remove({});
  },
  reimportSpreadsheet: function() {
    Songs.remove({});
    People.remove({});
    SongCount.remove({});

    var data = Papa.parse(Assets.getText("spreadsheet.csv"), {
      header: true,
      skipEmptyLines: true,
      complete: function(results) { console.log("Finished!"); },
      step: function(row) {
        // TODO: deal with "Chorus", "Traditional", "Western"
        var data = row.data[0];

        if (!data.song) return;

        var song = {
          title: trimSongTitle(data.song),
          type: getSongType(data.song_type),
          year: getYear(data.year),
          language: data.language
        };

        if (data.film_name) song.filmName = data.film_name;

        song.lyricists = _.map(getPersonNames(data.lyricist), addPerson);
        song.composers = _.map(getPersonNames(data.composer), addPerson);
        song.singers   = _.map(getPersonNames(data.singer),   addPerson);

        Songs.insert(song);
      }
    });

    if (SongCount.findOne())
      SongCount.update(SongCount.findOne()._id, {$set: {count: Songs.find().count()}});
    else
      SongCount.insert({count: Songs.find().count()});
  }
});

function getPersonNames(str) {
  var result = str;

  if (str.toLowerCase() === "not applicable") {
    return null;
  }
  else {
    result = result.replace("&", ",").replace(" and ", ",");
    return _.compact(_.map(result.split(","), function(name) {
      return name.replace(/^\s+|\s+$/g, '');
    }));
  }
}

function trimSongTitle(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function getSongType(type) {
  switch (type.toLowerCase()) {
    case "film song":
      return "film_song";
    case "nonfilm song":
      return "non_film_song";
    case "tv serial":
      return "serial";
    default:
      return null;
  }
}

function getYear(year) {
  console.log(year);
  switch (year.toLowerCase()) {
    case "":
    case "unknown":
      return null;
    default:
      return parseInt(year);
  }
}

function addPerson(name) {
  var existingPerson = People.findOne({name: name});
  if (existingPerson)
    return existingPerson._id;
  else
    return People.insert({name: name});
}
