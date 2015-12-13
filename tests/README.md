To run tests:

```bash
npm install .
npm test
```

This will spawn a Selenium server, which will allow Nightwatch to drive Firefox.

To write tests, drop more JS files with the appropriate exports in
`jolly-roger/tests/tests`, or add more tests to the `module.exports`
of an existing test set.
