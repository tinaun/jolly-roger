Schemas.Activity = new SimpleSchema([
  Schemas.Base,
  {
    hunt: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    puzzle: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    user: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    start: {
      type: Date,
    },

    // end represents the maximum confirmed date, so newly created
    // activities have start === end
    end: {
      type: Date,
    },
    state: {
      type: String,
      allowedValues: ['active', 'idle', 'blurred'],
    },
  },
]);

Models.Activity = new Models.Base('activity');
Models.Activity.attachSchema(Schemas.Activity);
