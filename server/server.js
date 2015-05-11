Meteor.publish("songs", function(id) {
  if (id)
    return Songs.find({_id: id});
  return Songs.find({}, {sort: {title: 1}});
});

Meteor.publish("people", function(id) {
  if (id)
    return People.find({_id: id});
  return People.find({}, {sort: {name: 1}});
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
  switch (year.toLowerCase()) {
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

Meteor.methods({
  reimportFromSpreadsheet: function() {
    Songs.remove({});
    People.remove({})

    var data = Papa.parse(Assets.getText("spreadsheet.csv"), {
      header: true,
      skipEmptyLines: true,
      complete: function(results) { console.log("Finished!"); },
      step: function(row) {
        // TODO: deal with "Chorus", "Traditional", "Western"
        var data = row.data[0];

        if (!data.song) return;

        var song = {
          title: data.song,
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
  }
});
