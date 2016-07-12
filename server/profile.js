import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Ansible from '/imports/ansible.js';

Meteor.methods({
  saveProfile(newProfile) {
    // Allow users to update/upsert profile data.
    check(this.userId, String);
    check(newProfile, {
      displayName: String,
      locationDuringHunt: String,
      phoneNumber: String,
      slackHandle: String,
      remote: Boolean,
      affiliation: String,
    });
    const user = Meteor.users.findOne(this.userId);
    const primaryEmail = user.emails[0].address;

    Ansible.log('Updating profile for user', {user: this.userId});
    const result = Models.Profiles.update({
      _id: this.userId,
    }, {
      $set: {
        displayName: newProfile.displayName,
        locationDuringHunt: newProfile.locationDuringHunt,
        primaryEmail: primaryEmail,
        phoneNumber: newProfile.phoneNumber,
        slackHandle: newProfile.slackHandle,
        remote: newProfile.remote,
        affiliation: newProfile.affiliation,
        deleted: false,
      },
    }, {
      upsert: true,
    });
  },
});
