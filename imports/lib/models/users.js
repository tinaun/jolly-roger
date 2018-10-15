import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

// Does not inherit from Schemas.Base
Schemas.User = new SimpleSchema({
  username: {
    type: String,
    optional: true,
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
  },
  emails: {
    type: [Object],
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  lastLogin: {
    type: Date,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  roles: {
    type: [String],
    optional: true,
  },
  hunts: {
    type: [String],
    defaultValue: [],
    regEx: SimpleSchema.RegEx.Id,
  },

  profile: {
    type: Object,
  },
  'profile.operating': {
    type: Boolean,
    defaultValue: false,
  },
});
Meteor.users.attachSchema(Schemas.User);

if (Meteor.isServer) {
  Meteor.publish('selfHuntMembership', function () {
    if (!this.userId) {
      return [];
    }

    return Meteor.users.find(this.userId, { fields: { hunts: 1 } });
  });

  Meteor.publish('huntMembers', function (huntId) {
    check(huntId, String);

    if (!this.userId) {
      return [];
    }

    const u = Meteor.users.findOne(this.userId);
    // Note: this is not reactive, so if hunt membership changes, this
    // behavior will change
    if (!_.contains(u.hunts, huntId)) {
      return [];
    }

    return Meteor.users.find({ hunts: huntId }, { fields: { hunts: 1 } });
  });

  Meteor.publish('userRoles', function (targetUserId) {
    check(targetUserId, String);

    // Only publish other users' roles to other operators.
    if (!Roles.userHasRole(this.userId, 'admin')) {
      return [];
    }

    return Meteor.users.find(targetUserId, { fields: { roles: 1 } });
  });
}