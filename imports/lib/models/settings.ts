import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/nicolaslopezj:roles';
import SettingsSchema, { SettingType } from '../schemas/settings';
import Base, { FindOptions } from './base';

const Settings = new Base<SettingType>('settings');
Settings.attachSchema(SettingsSchema);

// Publish manually instead of through Base.publish because we need to block the
// query for non-admins, and Base.publish doesn't support permission checks.
if (Meteor.isServer) {
  Meteor.publish('mongo.settings',
    function (q: Mongo.Selector<SettingType> = {}, opts: FindOptions = {}) {
      check(q, Object);
      check(opts, {
        fields: Match.Maybe(Object),
        sort: Match.Maybe(Object),
        skip: Match.Maybe(Number),
        limit: Match.Maybe(Number),
      });

      // Only allow admins to pull down Settings.
      if (!this.userId || !Roles.userHasRole(this.userId, 'admin')) {
        return [];
      }

      return Settings.find(q, opts);
    });
}
export default Settings;
