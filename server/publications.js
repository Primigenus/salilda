Meteor.publish("song", function(id) {
  return Songs.find({_id: id});
});

Meteor.publish("songsByPerson", function(personId) {
  fields = {title: 1};
  return Songs.find({
    $or: [
      {lyricists: {$elemMatch: {$eq: personId}}},
      {composers: {$elemMatch: {$eq: personId}}},
      {singers:   {$elemMatch: {$eq: personId}}}
    ]
  }, {fields: fields});
});

Meteor.publish("songs", function(id, page, filter) {
  if (_.isNumber(id))
    return Songs.find({_id: id});

  var pageSize = 50;
  var skip = _.isString(page) ? Math.max(0, parseInt(page) * pageSize - 50) : 0;
  var filterObj = _.isString(filter) ? { title: new RegExp(filter, "i") } : {};

  return Songs.find(filterObj, {
    fields: {title: 1, filmName: 1, year: 1, language: 1},
    sort: {title: 1},
    limit: pageSize,
    skip: skip
  });
});

Meteor.publish("songCount", function() {
  return SongCount.find();
});

Meteor.publish("person", function(personId) {
  console.log("Publish person", personId);
  return People.find({_id: personId});
});

Meteor.publish("people", function(ids) {
  console.log("Publish people", ids);
  if (_.isArray(ids))
    return People.find({_id: {$in: ids}}, {sort: {name: 1}});
  else
    return People.find({}, {sort: {name: 1}});
});
