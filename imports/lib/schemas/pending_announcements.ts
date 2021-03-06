import * as t from 'io-ts';
import SimpleSchema from 'simpl-schema';
import { BaseCodec, BaseOverrides } from './base';
import { Overrides, buildSchema, inheritSchema } from './typedSchemas';

const PendingAnnouncementFields = t.type({
  hunt: t.string,
  announcement: t.string,
  user: t.string,
});

const PendingAnnouncementFieldsOverrides: Overrides<t.TypeOf<typeof PendingAnnouncementFields>> = {
  hunt: {
    regEx: SimpleSchema.RegEx.Id,
  },
  announcement: {
    regEx: SimpleSchema.RegEx.Id,
  },
  user: {
    regEx: SimpleSchema.RegEx.Id,
  },
};

const [PendingAnnouncementCodec, PendingAnnouncementOverrides] = inheritSchema(
  BaseCodec, PendingAnnouncementFields,
  BaseOverrides, PendingAnnouncementFieldsOverrides,
);
export { PendingAnnouncementCodec };
export type PendingAnnouncementType = t.TypeOf<typeof PendingAnnouncementCodec>;

// Broadcast announcements that have not yet been viewed by a given
// user
const PendingAnnouncements = buildSchema(PendingAnnouncementCodec, PendingAnnouncementOverrides);

export default PendingAnnouncements;
