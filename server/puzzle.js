function getOrCreateTagByName(huntId, name) {
  let existingTag = Models.Tags.findOne({hunt: huntId, name: name});
  if (existingTag) {
    return existingTag;
  }
  let newTagId = Models.Tags.insert({hunt: huntId, name: name});
  return {
    _id: newTagId,
    hunt: huntId,
    name: name,
  };
}

Meteor.methods({
  createPuzzle(huntId, title, url, tags) {
    // Probably want to do some role check as well...
    check(this.userId, String);
    check(huntId, String);
    check(title, String);
    check(url, String);
    check(tags, [String]); // Note: tag names, not tag IDs.

    // Look up each tag by name and map them to tag IDs.
    tagIds = tags.map((tagName) => { return getOrCreateTagByName(huntId, tagName); });

    var puzzle = Models.Puzzles.insert({
      hunt: huntId,
      tags: tagIds,
      title: title,
      url: url,
    });

    // TODO: run any puzzle-creation hooks, like creating a Slack channel.
    // That hook should add a Schemas.ChatMetadata with the appropriate slackChannel from the
    // response.
    // The websocket listening for Slack messages should subscribe to that channel.

    return puzzle;
  },

  addTagToPuzzle(puzzleId, newTagName) {
    check(this.userId, String);
    check(puzzleId, String);
    check(newTagName, String);

    // Look up which hunt the specified puzzle is from.
    hunt = Models.Puzzles.findOne({
      _id: puzzleId
    }, {
      fields: {
        hunt: 1,
      }
    });
    let huntId = hunt && hunt.hunt;
    if (!huntId) throw new Error("No puzzle known with id " + puzzleId);
    console.log(huntId);
    let tagId = getOrCreateTagByName(huntId, newTagName);
    console.log(tagId);
    try {
      // This throws [RangeError: Maximum call stack size exceeded]
      let changes = Models.Puzzles.update({
        _id: puzzleId,
      }, {
        $push: {
          tags: tagId,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    //return changes;
  },

  /*
  removeTagFromPuzzle(puzzleId, tag) {
    check(this.userId, String);
    check(puzzleId, String);
    check(tag, String);
    var changes = Models.Puzzles.update({
      _id: puzzleId,
    }, {
      $pull: {
        tags: tag,
      },
    });
    return changes;
  },
  */
});
