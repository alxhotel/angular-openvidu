var test = require('tape');
var normalice = require('..');

runTests(require('./data/servers-url'));
runTests(require('./data/servers-string'));

function runTests(servers) {
  test('normalizing stun url', function(t) {
    var server;

    t.plan(5);
    t.ok(server = normalice(servers.stun[0]));
    t.equal(server.url, 'stun:stun.l.google.com:19302');
    t.deepEqual(server.urls, ['stun:stun.l.google.com:19302']);
    t.equal(server.username, undefined);
    t.equal(server.credential, undefined);
  });
}
