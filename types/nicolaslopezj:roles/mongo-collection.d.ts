declare module 'meteor/mongo' {
  module Mongo {
    interface Collection<T> {
      attachRoles(rolesPrefix: string, dontAllowAdmin?: boolean): void;
    }
  }
}
