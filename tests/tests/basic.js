'use strict';

module.exports = {};

module.exports['Test basic loading'] = function (client) {
  client
    .init()
    .waitForElementVisible('#at-field-email', 5000)
    .waitForElementVisible('#at-field-password', 100)
    .end();
};
