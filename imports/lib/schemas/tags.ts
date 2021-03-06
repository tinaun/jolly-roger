import * as t from 'io-ts';
import SimpleSchema from 'simpl-schema';
import { BaseCodec, BaseOverrides } from './base';
import { Overrides, buildSchema, inheritSchema } from './typedSchemas';

const TagFields = t.type({
  name: t.string,
  hunt: t.string,
});

const TagFieldsOverrides: Overrides<t.TypeOf<typeof TagFields>> = {
  hunt: {
    regEx: SimpleSchema.RegEx.Id,
  },
};

const [TagCodec, TagOverrides] = inheritSchema(
  BaseCodec, TagFields,
  BaseOverrides, TagFieldsOverrides,
);
export { TagCodec };
export type TagType = t.TypeOf<typeof TagCodec>;

const Tags = buildSchema(TagCodec, TagOverrides);

export default Tags;
