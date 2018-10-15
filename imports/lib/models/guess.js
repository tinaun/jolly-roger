import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { answerify, huntsMatchingCurrentUser } from '../../model-helpers.js';

Schemas.Guesses = new SimpleSchema([
  Schemas.Base,
  {
    hunt: {
      // Denormalized in so subscriptions can filter on hunt without having to join on Puzzles
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    puzzle: {
      // The puzzle this guess is for.
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    guess: {
      // The text of this guess.
      type: String,
      autoValue() {
        if (this.isSet) {
          return answerify(this.value);
        }

        return undefined;
      },
    },
    direction: {
      // Whether this was forward solved (10), backwards solved (-10),
      // or somewhere in between
      type: Number,
      min: -10,
      max: 10,
      // only optional in that old data won't have it
      optional: true,
    },
    confidence: {
      // Submitted-evaluated probability that the answer is right
      type: Number,
      min: 0,
      max: 100,
      // only optional in that old data won't have it
      optional: true,
    },
    state: {
      // The state of this guess, as handled by the operators:
      // * 'pending' means "shows up in the operator queue"
      // * 'correct', "incorrect", and "rejected" all mean "no longer in the operator queue"
      // * 'incorrect' answers should be listed or at least discoverable on the puzzle page
      // * 'correct' answers should be accompanied by an update to the corresponding puzzle's answer
      //   field.
      type: String,
      allowedValues: ['pending', 'correct', 'incorrect', 'rejected'],
    },
  },
]);
Models.Guesses = new Models.Base('guesses');
Models.Guesses.attachSchema(Schemas.Guesses);
Models.Guesses.publish(huntsMatchingCurrentUser);