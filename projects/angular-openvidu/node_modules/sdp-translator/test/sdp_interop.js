var Interop = require('../').Interop;

if (typeof QUnit == 'undefined') {
  QUnit = require('qunit-cli');
  QUnit.load();

  interop = require('..');
};

global.RTCSessionDescription = function (desc) {
  this.type = desc.type;
  this.sdp = desc.sdp;
}

global.RTCIceCandidate = function (cand) {
  this.candidate = cand.candidate;
  this.sdpMLineIndex = cand.sdpMLineIndex;
  this.sdpMid = cand.sdpMid;
}

var dumpSDP = function (description) {
  if (typeof description === 'undefined' || description === null) {
    return '';
  }
  return 'type: ' + description.type + '\r\n' + description.sdp;
};

QUnit.test('ChromePlanB2UnifiedPlan_1track', function (assert) {
  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 6352417452822806569 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=maxptime:60\r\n\
a=ssrc:3393882360 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:3393882360 msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 22345512-82de-4e55-b205-967e0249e8e0\r\n\
a=ssrc:3393882360 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:3393882360 label:22345512-82de-4e55-b205-967e0249e8e0\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=ssrc-group:FID 2560713622 1733429841\r\n\
a=ssrc:2560713622 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:2560713622 msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:2560713622 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:2560713622 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:1733429841 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:1733429841 msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:1733429841 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:1733429841 label:9203939c-25cf-4d60-82c2-d25b19350926"

  /*jshint multistr: true */
  var expectedUnifiedPlan =
    "v=0\r\n\
o=- 6352417452822806569 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-3393882360 video-1733429841\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:actpass\r\n\
a=mid:audio-3393882360\r\n\
a=msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 22345512-82de-4e55-b205-967e0249e8e0\r\n\
a=maxptime:60\r\n\
a=sendrecv\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=ssrc:3393882360 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:3393882360 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:3393882360 label:22345512-82de-4e55-b205-967e0249e8e0\r\n\
a=rtcp-mux\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=setup:actpass\r\n\
a=mid:video-1733429841\r\n\
a=msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=sendrecv\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=ssrc:1733429841 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:1733429841 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:1733429841 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:2560713622 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:2560713622 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:2560713622 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc-group:FID 2560713622 1733429841\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(offer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('ChromePlanB2UnifiedPlan_2tracks', function (assert) {
  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 6352417452822806569 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS 0ec45b31-e98d-49fa-b695-7631e004843a nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=maxptime:60\r\n\
a=ssrc:3393882360 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:3393882360 msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 22345512-82de-4e55-b205-967e0249e8e0\r\n\
a=ssrc:3393882360 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:3393882360 label:22345512-82de-4e55-b205-967e0249e8e0\r\n\
a=ssrc:2998362345 cname:XvUdN+mQ3KWuNJNu\r\n\
a=ssrc:2998362345 msid:0ec45b31-e98d-49fa-b695-7631e004843a 96a45cea-7b24-401f-b12b-92bead3bf181\r\n\
a=ssrc:2998362345 mslabel:0ec45b31-e98d-49fa-b695-7631e004843a\r\n\
a=ssrc:2998362345 label:96a45cea-7b24-401f-b12b-92bead3bf181\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=ssrc-group:FID 2560713622 1733429841\r\n\
a=ssrc:2560713622 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:2560713622 msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:2560713622 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:2560713622 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:1733429841 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:1733429841 msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:1733429841 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:1733429841 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc-group:FID 3792658351 624578865\r\n\
a=ssrc:3792658351 cname:XvUdN+mQ3KWuNJNu\r\n\
a=ssrc:3792658351 msid:0ec45b31-e98d-49fa-b695-7631e004843a 6f961540-d5ee-46da-a5b7-b42b97211905\r\n\
a=ssrc:3792658351 mslabel:0ec45b31-e98d-49fa-b695-7631e004843a\r\n\
a=ssrc:3792658351 label:6f961540-d5ee-46da-a5b7-b42b97211905\r\n\
a=ssrc:624578865 cname:XvUdN+mQ3KWuNJNu\r\n\
a=ssrc:624578865 msid:0ec45b31-e98d-49fa-b695-7631e004843a 6f961540-d5ee-46da-a5b7-b42b97211905\r\n\
a=ssrc:624578865 mslabel:0ec45b31-e98d-49fa-b695-7631e004843a\r\n\
a=ssrc:624578865 label:6f961540-d5ee-46da-a5b7-b42b97211905"

  /*jshint multistr: true */
  var expectedUnifiedPlan =
    "v=0\r\n\
o=- 6352417452822806569 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-2998362345 audio-3393882360 video-624578865 video-1733429841\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:actpass\r\n\
a=mid:audio-2998362345\r\n\
a=msid:0ec45b31-e98d-49fa-b695-7631e004843a 96a45cea-7b24-401f-b12b-92bead3bf181\r\n\
a=maxptime:60\r\n\
a=sendrecv\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=ssrc:2998362345 cname:XvUdN+mQ3KWuNJNu\r\n\
a=ssrc:2998362345 mslabel:0ec45b31-e98d-49fa-b695-7631e004843a\r\n\
a=ssrc:2998362345 label:96a45cea-7b24-401f-b12b-92bead3bf181\r\n\
a=rtcp-mux\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:actpass\r\n\
a=mid:audio-3393882360\r\n\
a=msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 22345512-82de-4e55-b205-967e0249e8e0\r\n\
a=maxptime:60\r\n\
a=sendrecv\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=ssrc:3393882360 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:3393882360 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:3393882360 label:22345512-82de-4e55-b205-967e0249e8e0\r\n\
a=rtcp-mux\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=setup:actpass\r\n\
a=mid:video-624578865\r\n\
a=msid:0ec45b31-e98d-49fa-b695-7631e004843a 6f961540-d5ee-46da-a5b7-b42b97211905\r\n\
a=sendrecv\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=ssrc:624578865 cname:XvUdN+mQ3KWuNJNu\r\n\
a=ssrc:624578865 mslabel:0ec45b31-e98d-49fa-b695-7631e004843a\r\n\
a=ssrc:624578865 label:6f961540-d5ee-46da-a5b7-b42b97211905\r\n\
a=ssrc:3792658351 cname:XvUdN+mQ3KWuNJNu\r\n\
a=ssrc:3792658351 mslabel:0ec45b31-e98d-49fa-b695-7631e004843a\r\n\
a=ssrc:3792658351 label:6f961540-d5ee-46da-a5b7-b42b97211905\r\n\
a=ssrc-group:FID 3792658351 624578865\r\n\
a=rtcp-mux\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=setup:actpass\r\n\
a=mid:video-1733429841\r\n\
a=msid:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c 9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=sendrecv\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=ssrc:1733429841 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:1733429841 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:1733429841 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:2560713622 cname:5YcASuDc3X86mu+d\r\n\
a=ssrc:2560713622 mslabel:nnnwYrPTpGmyoJX5GFHMVv42y1ZthbnCx26c\r\n\
a=ssrc:2560713622 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc-group:FID 2560713622 1733429841\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(offer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")

  /* #region Check Unified Plan candidates */
  var candUnifiedPlan = new RTCIceCandidate ({
    "candidate" : "candidate:11111111 1 udp 22222222 10.0.0.1 2345 typ host generation 0",
    "sdpMLineIndex" : 0,
    "sdpMid" : "audio-2998362345"
  });
  var candPlanB = interop.candidateToPlanB (candUnifiedPlan);
  assert.equal(candPlanB.candidate, candUnifiedPlan.candidate, "candidate arg not matching");
  assert.equal(candPlanB.sdpMid, "audio", "sdpMid arg not matching");
  assert.equal(candPlanB.sdpMLineIndex, 0, "sdpMLineIndex arg not matching");

  var candUnifiedPlan = new RTCIceCandidate ({
    "candidate" : "candidate:11111111 1 udp 22222222 10.0.0.1 2345 typ host generation 0",
    "sdpMLineIndex" : 1,
    "sdpMid" : "audio-3393882360"
  });
  var candPlanB = interop.candidateToPlanB (candUnifiedPlan);
  assert.equal(candPlanB.candidate, candUnifiedPlan.candidate, "candidate arg not matching");
  assert.equal(candPlanB.sdpMid, "audio", "sdpMid arg not matching");
  assert.equal(candPlanB.sdpMLineIndex, 0, "sdpMLineIndex arg not matching");

  var candUnifiedPlan = new RTCIceCandidate ({
    "candidate" : "candidate:11111111 1 udp 22222222 10.0.0.1 2345 typ host generation 0",
    "sdpMLineIndex" : 2,
    "sdpMid" : "video-624578865"
  });
  var candPlanB = interop.candidateToPlanB (candUnifiedPlan);
  assert.equal(candPlanB.candidate, candUnifiedPlan.candidate, "candidate arg not matching");
  assert.equal(candPlanB.sdpMid, "video", "sdpMid arg not matching");
  assert.equal(candPlanB.sdpMLineIndex, 1, "sdpMLineIndex arg not matching");

  var candUnifiedPlan = new RTCIceCandidate ({
    "candidate" : "candidate:11111111 1 udp 22222222 10.0.0.1 2345 typ host generation 0",
    "sdpMLineIndex" : 3,
    "sdpMid" : "video-1733429841"
  });
  var candPlanB = interop.candidateToPlanB (candUnifiedPlan);
  assert.equal(candPlanB.candidate, candUnifiedPlan.candidate, "candidate arg not matching");
  assert.equal(candPlanB.sdpMid, "video", "sdpMid arg not matching");
  assert.equal(candPlanB.sdpMLineIndex, 1, "sdpMLineIndex arg not matching");
  /* #endregion */

  /* #region Check Plan B candidates */
  var candPlanB = new RTCIceCandidate ({
    "candidate" : "candidate:11111111 1 udp 22222222 10.0.0.1 2345 typ host generation 0",
    "sdpMLineIndex" : 0,
    "sdpMid" : "audio"
  });
  var candUnifiedPlan = interop.candidateToUnifiedPlan (candPlanB);
  assert.equal(candUnifiedPlan.candidate, candPlanB.candidate, "candidate arg not matching");
  assert.equal(candUnifiedPlan.sdpMid, "audio", "sdpMid arg not matching");
  assert.equal(candUnifiedPlan.sdpMLineIndex, 0, "sdpMLineIndex arg not matching");

  var candPlanB = new RTCIceCandidate ({
    "candidate" : "candidate:11111111 1 udp 22222222 10.0.0.1 2345 typ host generation 0",
    "sdpMLineIndex" : 1,
    "sdpMid" : "video"
  });
  var candUnifiedPlan = interop.candidateToUnifiedPlan (candPlanB);
  assert.equal(candUnifiedPlan.candidate, candPlanB.candidate, "candidate arg not matching");
  assert.equal(candUnifiedPlan.sdpMid, "video", "sdpMid arg not matching");
  assert.equal(candUnifiedPlan.sdpMLineIndex, 2, "sdpMLineIndex arg not matching");
  /* #endregion */
});

QUnit.test('sendonlyPlanB2UnifiedPlan', function (assert) {
  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 6352417452822806569 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS MS-0\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=ssrc:1001 cname:CN-0\r\n\
a=ssrc:1001 msid:MS-0 MST-0_0\r\n\
a=ssrc:1001 mslabel:MS-0\r\n\
a=ssrc:1001 label:MST-0_0\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=ssrc-group:FID 2001\r\n\
a=ssrc:2001 cname:CN-0\r\n\
a=ssrc:2001 msid:MS-0 9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=ssrc:2001 mslabel:MS-0\r\n\
a=ssrc:2001 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n"

  /*jshint multistr: true */
  var expectedUnifiedPlan =
    "v=0\r\n\
o=- 6352417452822806569 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-1001 video-2001\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=setup:actpass\r\n\
a=mid:audio-1001\r\n\
a=msid:MS-0 MST-0_0\r\n\
a=sendonly\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=ssrc:1001 cname:CN-0\r\n\
a=ssrc:1001 mslabel:MS-0\r\n\
a=ssrc:1001 label:MST-0_0\r\n\
a=rtcp-mux\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=setup:actpass\r\n\
a=mid:video-2001\r\n\
a=msid:MS-0 9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=sendonly\r\n\
a=ice-ufrag:xHOGnBsKDPCmHB5t\r\n\
a=ice-pwd:qpnbhhoyeTrypBkX5F1u338T\r\n\
a=fingerprint:sha-256 58:E0:FE:56:6A:8C:5A:AD:71:5B:A0:52:47:27:60:66:27:53:EC:B6:F3:03:A8:4B:9B:30:28:62:29:49:C6:73\r\n\
a=ssrc:2001 cname:CN-0\r\n\
a=ssrc:2001 mslabel:MS-0\r\n\
a=ssrc:2001 label:9203939c-25cf-4d60-82c2-d25b19350926\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(offer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('audioInactiveUnifiedPlan2PlanB', function (assert) {
  /*jshint multistr: true */
  var originUnifiedPlan =
    "v=0\r\n\
o=- 3656853607 3656853607 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE video-65477720 video-774581929\r\n\
m=audio 0 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
a=inactive\r\n\
a=mid:audio-2331169307\r\n\
m=audio 0 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
a=inactive\r\n\
a=mid:audio-3362868299\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=mid:video-65477720\r\n\
a=recvonly\r\n\
a=rtcp-mux\r\n\
a=ssrc:3850339357 cname:user1483941637@host-3c4150dc\r\n\
a=ice-ufrag:l+rG\r\n\
a=ice-pwd:Ab5LzP5Wn5dBfC6ct6Xhg3\r\n\
a=fingerprint:sha-256 E7:70:CE:58:6A:CC:77:B0:B4:4B:F2:BC:7E:89:0D:69:E3:90:F3:7A:11:78:B1:5A:CD:E6:41:19:14:EB:56:49\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=mid:video-774581929\r\n\
a=recvonly\r\n\
a=rtcp-mux\r\n\
a=ssrc:3423627266 cname:user1483941637@host-3c4150dc\r\n\
a=ice-ufrag:l+rG\r\n\
a=ice-pwd:Ab5LzP5Wn5dBfC6ct6Xhg3\r\n\
a=fingerprint:sha-256 E7:70:CE:58:6A:CC:77:B0:B4:4B:F2:BC:7E:89:0D:69:E3:90:FR3:7A:11:78:B1:5A:CD:E6:41:19:14:EB:56:49\r\n"

  /*jshint multistr: true */
  var expectedPlanB =
    "v=0\r\n\
o=- 3656853607 3656853607 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio video\r\n\
m=audio 0 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
a=mid:audio\r\n\
a=inactive\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:video\r\n\
a=recvonly\r\n\
a=ice-ufrag:l+rG\r\n\
a=ice-pwd:Ab5LzP5Wn5dBfC6ct6Xhg3\r\n\
a=fingerprint:sha-256 E7:70:CE:58:6A:CC:77:B0:B4:4B:F2:BC:7E:89:0D:69:E3:90:F3:7A:11:78:B1:5A:CD:E6:41:19:14:EB:56:49\r\n\
a=ssrc:3423627266 cname:user1483941637@host-3c4150dc\r\n\
a=ssrc:3850339357 cname:user1483941637@host-3c4150dc\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var answer = new RTCSessionDescription({
    type: 'answer',
    sdp: originUnifiedPlan
  });

  var planBDesc = interop.toPlanB(answer);
  assert.equal(planBDesc.sdp, expectedPlanB,
    "Not expected Plan B output")
});

QUnit.test('1audio1videoInactivesUnifiedPlan2PlanB', function (assert) {
  /*jshint multistr: true */
  var originUnifiedPlan =
    "v=0\r\n\
o=- 3656853607 3656853607 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-3362868299 video-774581929\r\n\
m=audio 0 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=inactive\r\n\
a=mid:audio-2331169307\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=setup:active\r\n\
a=mid:audio-3362868299\r\n\
a=recvonly\r\n\
a=rtcp-mux\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=maxptime:60\r\n\
a=ssrc:4147269654 cname:user1483941637@host-3c4150dc\r\n\
a=ice-ufrag:l+rG\r\n\
a=ice-pwd:Ab5LzP5Wn5dBfC6ct6Xhg3\r\n\
a=fingerprint:sha-256 E7:70:CE:58:6A:CC:77:B0:B4:4B:F2:BC:7E:89:0D:69:E3:90:F3:7A:11:78:B1:5A:CD:E6:41:19:14:EB:56:49\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100 116 117 96\r\n\
a=inactive\r\n\
a=mid:video-65477720\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=mid:video-774581929\r\n\
a=recvonly\r\n\
a=rtcp-mux\r\n\
a=ssrc:3423627266 cname:user1483941637@host-3c4150dc\r\n\
a=ice-ufrag:l+rG\r\n\
a=ice-pwd:Ab5LzP5Wn5dBfC6ct6Xhg3\r\n\
a=fingerprint:sha-256 E7:70:CE:58:6A:CC:77:B0:B4:4B:F2:BC:7E:89:0D:69:E3:90:F3:7A:11:78:B1:5A:CD:E6:41:19:14:EB:56:49\r\n"

  /*jshint multistr: true */
  var expectedPlanB =
   "v=0\r\n\
o=- 3656853607 3656853607 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio video\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:audio\r\n\
a=maxptime:60\r\n\
a=recvonly\r\n\
a=ice-ufrag:l+rG\r\n\
a=ice-pwd:Ab5LzP5Wn5dBfC6ct6Xhg3\r\n\
a=fingerprint:sha-256 E7:70:CE:58:6A:CC:77:B0:B4:4B:F2:BC:7E:89:0D:69:E3:90:F3:7A:11:78:B1:5A:CD:E6:41:19:14:EB:56:49\r\n\
a=ssrc:4147269654 cname:user1483941637@host-3c4150dc\r\n\
a=rtcp-mux\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:video\r\n\
a=recvonly\r\n\
a=ice-ufrag:l+rG\r\n\
a=ice-pwd:Ab5LzP5Wn5dBfC6ct6Xhg3\r\n\
a=fingerprint:sha-256 E7:70:CE:58:6A:CC:77:B0:B4:4B:F2:BC:7E:89:0D:69:E3:90:F3:7A:11:78:B1:5A:CD:E6:41:19:14:EB:56:49\r\n\
a=ssrc:3423627266 cname:user1483941637@host-3c4150dc\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var answer = new RTCSessionDescription({
    type: 'answer',
    sdp: originUnifiedPlan
  });

  var planBDesc = interop.toPlanB(answer);
  assert.equal(planBDesc.sdp, expectedPlanB,
    "Not expected Plan B output")
});

QUnit.test('answerChromePlanB2UnifiedPlan', function (assert) {
  /*jshint multistr: true */
  var originUnifiedPlan =
    "v=0\r\n\
o=- 3657363455 3657363455 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=group:BUNDLE audio0 video0 video1\r\n\
m=audio 1 RTP/SAVPF 96 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=ssrc:3563419008 cname:user3545937947@host-98980057\r\n\
a=msid:ms 0\r\n\
a=ssrc:3563419008 mslabel:ms\r\n\
a=ssrc:3563419008 label:0\r\n\
a=ice-ufrag:Cm5n\r\n\
a=ice-pwd:n40sz+gvZaHn7jKWttb5qg\r\n\
a=fingerprint:sha-256 BF:5F:83:8D:B3:40:21:95:46:FC:F5:C1:1E:F1:C9:C2:9D:F4:A8:90:A0:F9:7C:41:CD:60:91:A7:3D:0A:F3:99\r\n\
a=mid:audio0\r\n\
m=video 1 RTP/SAVPF 99\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:99 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=rtcp-fb:99 nack\r\n\
a=rtcp-fb:99 nack pli\r\n\
a=rtcp-fb:99 goog-remb\r\n\
a=rtcp-fb:99 ccm fir\r\n\
a=ssrc:593546241 cname:user3545937947@host-98980057\r\n\
a=msid:ms 1\r\n\
a=ssrc:593546241 mslabel:ms\r\n\
a=ssrc:593546241 label:1\r\n\
a=ice-ufrag:Cm5n\r\n\
a=ice-pwd:n40sz+gvZaHn7jKWttb5qg\r\n\
a=fingerprint:sha-256 BF:5F:83:8D:B3:40:21:95:46:FC:F5:C1:1E:F1:C9:C2:9D:F4:A8:90:A0:F9:7C:41:CD:60:91:A7:3D:0A:F3:99\r\n\
a=mid:video0\r\n\
m=video 1 RTP/SAVPF 99\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:99 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=rtcp-fb:99 nack\r\n\
a=rtcp-fb:99 nack pli\r\n\
a=rtcp-fb:99 goog-remb\r\n\
a=rtcp-fb:99 ccm fir\r\n\
a=ssrc:3172327889 cname:user3545937947@host-98980057\r\n\
a=msid:ms 2\r\n\
a=ssrc:3172327889 mslabel:ms\r\n\
a=ssrc:3172327889 label:2\r\n\
a=ice-ufrag:Cm5n\r\n\
a=ice-pwd:n40sz+gvZaHn7jKWttb5qg\r\n\
a=fingerprint:sha-256 BF:5F:83:8D:B3:40:21:95:46:FC:F5:C1:1E:F1:C9:C2:9D:F4:A8:90:A0:F9:7C:41:CD:60:91:A7:3D:0A:F3:99\r\n\
a=mid:video1"

  /*jshint multistr: true */
  var expectedPlanB =
    "v=0\r\n\
o=- 3657363455 3657363455 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio video\r\n\
m=audio 1 RTP/SAVPF 96 0\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:audio\r\n\
a=ice-ufrag:Cm5n\r\n\
a=ice-pwd:n40sz+gvZaHn7jKWttb5qg\r\n\
a=fingerprint:sha-256 BF:5F:83:8D:B3:40:21:95:46:FC:F5:C1:1E:F1:C9:C2:9D:F4:A8:90:A0:F9:7C:41:CD:60:91:A7:3D:0A:F3:99\r\n\
a=ssrc:3563419008 cname:user3545937947@host-98980057\r\n\
a=ssrc:3563419008 mslabel:ms\r\n\
a=ssrc:3563419008 label:0\r\n\
a=ssrc:3563419008 msid:ms 0\r\n\
a=rtcp-mux\r\n\
m=video 1 RTP/SAVPF 99\r\n\
b=AS:2000\r\n\
a=rtpmap:99 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:99 nack\r\n\
a=rtcp-fb:99 nack pli\r\n\
a=rtcp-fb:99 goog-remb\r\n\
a=rtcp-fb:99 ccm fir\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:video\r\n\
a=ice-ufrag:Cm5n\r\n\
a=ice-pwd:n40sz+gvZaHn7jKWttb5qg\r\n\
a=fingerprint:sha-256 BF:5F:83:8D:B3:40:21:95:46:FC:F5:C1:1E:F1:C9:C2:9D:F4:A8:90:A0:F9:7C:41:CD:60:91:A7:3D:0A:F3:99\r\n\
a=ssrc:593546241 cname:user3545937947@host-98980057\r\n\
a=ssrc:593546241 mslabel:ms\r\n\
a=ssrc:593546241 label:1\r\n\
a=ssrc:593546241 msid:ms 1\r\n\
a=ssrc:3172327889 cname:user3545937947@host-98980057\r\n\
a=ssrc:3172327889 mslabel:ms\r\n\
a=ssrc:3172327889 label:2\r\n\
a=ssrc:3172327889 msid:ms 2\r\n\
a=rtcp-mux\r\n"

  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 590499500270831419 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS\r\n\
m=audio 9 RTP/SAVPF 96 0\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:D/SIZC9xg+MActHq\r\n\
a=ice-pwd:0AJ690SNxw0UHVNmIZDEBHQy\r\n\
a=fingerprint:sha-256 D2:7A:84:32:AE:19:4A:C0:96:33:36:61:81:F2:BD:2C:57:9E:79:EE:56:5B:1D:19:37:E4:AC:ED:70:C8:79:72\r\n\
a=setup:active\r\n\
a=mid:audio\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=fmtp:96 minptime=10; useinbandfec=1\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=maxptime:60\r\n\
m=video 9 RTP/SAVPF 99\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:D/SIZC9xg+MActHq\r\n\
a=ice-pwd:0AJ690SNxw0UHVNmIZDEBHQy\r\n\
a=fingerprint:sha-256 D2:7A:84:32:AE:19:4A:C0:96:33:36:61:81:F2:BD:2C:57:9E:79:EE:56:5B:1D:19:37:E4:AC:ED:70:C8:79:72\r\n\
a=setup:active\r\n\
a=mid:video\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:99 VP8/90000\r\n\
a=rtcp-fb:99 ccm fir\r\n\
a=rtcp-fb:99 nack\r\n\
a=rtcp-fb:99 nack pli\r\n\
a=rtcp-fb:99 goog-remb"

  /*jshint multistr: true */
  var expectedUnifiedPlan =
    "v=0\r\n\
o=- 590499500270831419 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio0 video0 video1\r\n\
m=audio 1 RTP/SAVPF 96 0\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:audio0\r\n\
a=recvonly\r\n\
a=ice-ufrag:D/SIZC9xg+MActHq\r\n\
a=ice-pwd:0AJ690SNxw0UHVNmIZDEBHQy\r\n\
a=fingerprint:sha-256 D2:7A:84:32:AE:19:4A:C0:96:33:36:61:81:F2:BD:2C:57:9E:79:EE:56:5B:1D:19:37:E4:AC:ED:70:C8:79:72\r\n\
a=rtcp-mux\r\n\
m=video 1 RTP/SAVPF 99\r\n\
b=AS:2000\r\n\
a=rtpmap:99 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:99 ccm fir\r\n\
a=rtcp-fb:99 nack\r\n\
a=rtcp-fb:99 nack pli\r\n\
a=rtcp-fb:99 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:video0\r\n\
a=recvonly\r\n\
a=ice-ufrag:D/SIZC9xg+MActHq\r\n\
a=ice-pwd:0AJ690SNxw0UHVNmIZDEBHQy\r\n\
a=fingerprint:sha-256 D2:7A:84:32:AE:19:4A:C0:96:33:36:61:81:F2:BD:2C:57:9E:79:EE:56:5B:1D:19:37:E4:AC:ED:70:C8:79:72\r\n\
a=rtcp-mux\r\n\
m=video 1 RTP/SAVPF 99\r\n\
b=AS:2000\r\n\
a=rtpmap:99 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:99 ccm fir\r\n\
a=rtcp-fb:99 nack\r\n\
a=rtcp-fb:99 nack pli\r\n\
a=rtcp-fb:99 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:video1\r\n\
a=recvonly\r\n\
a=ice-ufrag:D/SIZC9xg+MActHq\r\n\
a=ice-pwd:0AJ690SNxw0UHVNmIZDEBHQy\r\n\
a=fingerprint:sha-256 D2:7A:84:32:AE:19:4A:C0:96:33:36:61:81:F2:BD:2C:57:9E:79:EE:56:5B:1D:19:37:E4:AC:ED:70:C8:79:72\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originUnifiedPlan
  });

  var planBDesc = interop.toPlanB(offer);
  assert.equal(planBDesc.sdp, expectedPlanB,
    "Not expected Plan B output")

  var answer = new RTCSessionDescription({
    type: 'answer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(answer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('answerChromeAsSenderPlanB2UnifiedPlan', function (assert) {
  /*jshint multistr: true */
  var originUnifiedPlan =
    "v=0\r\n\
o=- 3662296925 3662296925 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=group:BUNDLE audio0 video0\r\n\
m=audio 1 RTP/SAVPF 96 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=mid:audio0\r\n\
a=ssrc:2436440562 cname:user3751582401@host-766297e3\r\n\
a=msid:ms-0 0\r\n\
a=ssrc:2436440562 mslabel:ms-0\r\n\
a=ssrc:2436440562 label:0\r\n\
a=ice-ufrag:ABVj\r\n\
a=ice-pwd:kWL7Ao3kOEU5iqyUfysrYv\r\n\
a=fingerprint:sha-256 3D:2C:7D:F6:55:E8:77:E2:4D:51:F2:88:7F:28:DA:F0:8A:6A:59:62:77:05:19:25:CC:9A:9D:7F:98:98:84:AE\r\n\
m=video 1 RTP/SAVPF 97\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:97 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=mid:video0\r\n\
a=rtcp-fb:97 nack\r\n\
a=rtcp-fb:97 nack pli\r\n\
a=rtcp-fb:97 goog-remb\r\n\
a=rtcp-fb:97 ccm fir\r\n\
a=ssrc:757911244 cname:user3751582401@host-766297e3\r\n\
a=msid:ms-0 1\r\n\
a=ssrc:757911244 mslabel:ms-0\r\n\
a=ssrc:757911244 label:1\r\n\
a=ice-ufrag:ABVj\r\n\
a=ice-pwd:kWL7Ao3kOEU5iqyUfysrYv\r\n\
a=fingerprint:sha-256 3D:2C:7D:F6:55:E8:77:E2:4D:51:F2:88:7F:28:DA:F0:8A:6A:59:62:77:05:19:25:CC:9A:9D:7F:98:98:84:AE\r\n"

  /*jshint multistr: true */
  var expectedPlanB =
    "v=0\r\n\
o=- 3662296925 3662296925 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio video\r\n\
m=audio 1 RTP/SAVPF 96 0\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:audio\r\n\
a=ice-ufrag:ABVj\r\n\
a=ice-pwd:kWL7Ao3kOEU5iqyUfysrYv\r\n\
a=fingerprint:sha-256 3D:2C:7D:F6:55:E8:77:E2:4D:51:F2:88:7F:28:DA:F0:8A:6A:59:62:77:05:19:25:CC:9A:9D:7F:98:98:84:AE\r\n\
a=ssrc:2436440562 cname:user3751582401@host-766297e3\r\n\
a=ssrc:2436440562 mslabel:ms-0\r\n\
a=ssrc:2436440562 label:0\r\n\
a=ssrc:2436440562 msid:ms-0 0\r\n\
a=rtcp-mux\r\n\
m=video 1 RTP/SAVPF 97\r\n\
b=AS:2000\r\n\
a=rtpmap:97 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:97 nack\r\n\
a=rtcp-fb:97 nack pli\r\n\
a=rtcp-fb:97 goog-remb\r\n\
a=rtcp-fb:97 ccm fir\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:video\r\n\
a=ice-ufrag:ABVj\r\n\
a=ice-pwd:kWL7Ao3kOEU5iqyUfysrYv\r\n\
a=fingerprint:sha-256 3D:2C:7D:F6:55:E8:77:E2:4D:51:F2:88:7F:28:DA:F0:8A:6A:59:62:77:05:19:25:CC:9A:9D:7F:98:98:84:AE\r\n\
a=ssrc:757911244 cname:user3751582401@host-766297e3\r\n\
a=ssrc:757911244 mslabel:ms-0\r\n\
a=ssrc:757911244 label:1\r\n\
a=ssrc:757911244 msid:ms-0 1\r\n\
a=rtcp-mux\r\n"

  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 7577719950547761212 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS IfJVHad8MuDaHZN3BqwOEajvjBiel1H29lRu\r\n\
m=audio 9 RTP/SAVPF 96 0\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:eeAaTQp8Bz2m5EIr\r\n\
a=ice-pwd:JshDr8jaKU92bdj1IvSNQxnD\r\n\
a=fingerprint:sha-256 C0:15:C5:18:E4:86:EE:84:B9:05:F2:F8:A2:0F:87:E7:C8:CF:93:66:C3:F3:F6:85:E4:0F:B5:84:AD:A2:75:B2\r\n\
a=setup:active\r\n\
a=mid:audio\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=fmtp:96 minptime=10; useinbandfec=1\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=maxptime:60\r\n\
a=ssrc:2408808671 cname:AAzXxskrCZzvzGxA\r\n\
a=ssrc:2408808671 msid:IfJVHad8MuDaHZN3BqwOEajvjBiel1H29lRu 46fbfa41-04c5-450b-9884-9720e0f65e12\r\n\
a=ssrc:2408808671 mslabel:IfJVHad8MuDaHZN3BqwOEajvjBiel1H29lRu\r\n\
a=ssrc:2408808671 label:46fbfa41-04c5-450b-9884-9720e0f65e12\r\n\
m=video 9 RTP/SAVPF 97\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:eeAaTQp8Bz2m5EIr\r\n\
a=ice-pwd:JshDr8jaKU92bdj1IvSNQxnD\r\n\
a=fingerprint:sha-256 C0:15:C5:18:E4:86:EE:84:B9:05:F2:F8:A2:0F:87:E7:C8:CF:93:66:C3:F3:F6:85:E4:0F:B5:84:AD:A2:75:B2\r\n\
a=setup:active\r\n\
a=mid:video\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:97 VP8/90000\r\n\
a=rtcp-fb:97 ccm fir\r\n\
a=rtcp-fb:97 nack\r\n\
a=rtcp-fb:97 nack pli\r\n\
a=rtcp-fb:97 goog-remb\r\n\
a=ssrc:3493232231 cname:AAzXxskrCZzvzGxA\r\n\
a=ssrc:3493232231 msid:IfJVHad8MuDaHZN3BqwOEajvjBiel1H29lRu f3918557-3d3a-4917-bc8b-661c07aea169\r\n\
a=ssrc:3493232231 mslabel:IfJVHad8MuDaHZN3BqwOEajvjBiel1H29lRu\r\n\
a=ssrc:3493232231 label:f3918557-3d3a-4917-bc8b-661c07aea169\r\n"

  /*jshint multistr: true */
  var expectedUnifiedPlan =
    "v=0\r\n\
o=- 7577719950547761212 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio0 video0\r\n\
m=audio 1 RTP/SAVPF 96 0\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:audio0\r\n\
a=sendrecv\r\n\
a=ice-ufrag:eeAaTQp8Bz2m5EIr\r\n\
a=ice-pwd:JshDr8jaKU92bdj1IvSNQxnD\r\n\
a=fingerprint:sha-256 C0:15:C5:18:E4:86:EE:84:B9:05:F2:F8:A2:0F:87:E7:C8:CF:93:66:C3:F3:F6:85:E4:0F:B5:84:AD:A2:75:B2\r\n\
a=ssrc:2408808671 cname:AAzXxskrCZzvzGxA\r\n\
a=ssrc:2408808671 mslabel:IfJVHad8MuDaHZN3BqwOEajvjBiel1H29lRu\r\n\
a=ssrc:2408808671 label:46fbfa41-04c5-450b-9884-9720e0f65e12\r\n\
a=rtcp-mux\r\n\
m=video 1 RTP/SAVPF 97\r\n\
b=AS:2000\r\n\
a=rtpmap:97 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:97 ccm fir\r\n\
a=rtcp-fb:97 nack\r\n\
a=rtcp-fb:97 nack pli\r\n\
a=rtcp-fb:97 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:video0\r\n\
a=sendrecv\r\n\
a=ice-ufrag:eeAaTQp8Bz2m5EIr\r\n\
a=ice-pwd:JshDr8jaKU92bdj1IvSNQxnD\r\n\
a=fingerprint:sha-256 C0:15:C5:18:E4:86:EE:84:B9:05:F2:F8:A2:0F:87:E7:C8:CF:93:66:C3:F3:F6:85:E4:0F:B5:84:AD:A2:75:B2\r\n\
a=ssrc:3493232231 cname:AAzXxskrCZzvzGxA\r\n\
a=ssrc:3493232231 mslabel:IfJVHad8MuDaHZN3BqwOEajvjBiel1H29lRu\r\n\
a=ssrc:3493232231 label:f3918557-3d3a-4917-bc8b-661c07aea169\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originUnifiedPlan
  });

  var planBDesc = interop.toPlanB(offer);
  assert.equal(planBDesc.sdp, expectedPlanB,
    "Not expected Plan B output")

  var answer = new RTCSessionDescription({
    type: 'answer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(answer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('ChromePlanB2UnifiedPlan_offer_recvonly', function (assert) {
  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 5223234492575663261 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:VI6x/eXAwICStpq4\r\n\
a=ice-pwd:ukss7EaFw6RovD2phIZ9lHll\r\n\
a=fingerprint:sha-256 DF:6D:A3:7F:CD:7A:B2:4F:84:2F:04:EA:C3:48:CA:43:FC:1D:24:07:D2:3D:CB:92:2F:40:4A:71:85:B5:F9:56\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=maxptime:60\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 101 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:VI6x/eXAwICStpq4\r\n\
a=ice-pwd:ukss7EaFw6RovD2phIZ9lHll\r\n\
a=fingerprint:sha-256 DF:6D:A3:7F:CD:7A:B2:4F:84:2F:04:EA:C3:48:CA:43:FC:1D:24:07:D2:3D:CB:92:2F:40:4A:71:85:B5:F9:56\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=recvonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100"

  /*jshint multistr: true */
  var expectedUnifiedPlan = /* The same but in line in different order */
   "v=0\r\n\
o=- 5223234492575663261 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio video\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=maxptime:60\r\n\
a=recvonly\r\n\
a=ice-ufrag:VI6x/eXAwICStpq4\r\n\
a=ice-pwd:ukss7EaFw6RovD2phIZ9lHll\r\n\
a=fingerprint:sha-256 DF:6D:A3:7F:CD:7A:B2:4F:84:2F:04:EA:C3:48:CA:43:FC:1D:24:07:D2:3D:CB:92:2F:40:4A:71:85:B5:F9:56\r\n\
a=rtcp-mux\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 101 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=recvonly\r\n\
a=ice-ufrag:VI6x/eXAwICStpq4\r\n\
a=ice-pwd:ukss7EaFw6RovD2phIZ9lHll\r\n\
a=fingerprint:sha-256 DF:6D:A3:7F:CD:7A:B2:4F:84:2F:04:EA:C3:48:CA:43:FC:1D:24:07:D2:3D:CB:92:2F:40:4A:71:85:B5:F9:56\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(offer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('ChromePlanB2UnifiedPlan_simulcast', function (assert) {
  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 3154774635554078802 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU qCJz9KUv8my1ymOofvsnbuEty6dYudDtmZM3\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:/LqjwfEbqKQ3f3wD\r\n\
a=ice-pwd:rg4H+j0AEvnxp4Th847dGznM\r\n\
a=fingerprint:sha-256 ED:AD:B3:20:A5:E1:4A:A6:DB:7A:43:C3:E3:E0:25:47:CA:F9:51:C5:CE:96:DF:49:95:1F:A5:92:21:8A:77:56\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=maxptime:60\r\n\
a=ssrc:110 cname:95qLJLELw6Trsslz\r\n\
a=ssrc:110 msid:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU 29c336da-a4c0-4ae3-98c3-01dcb045ea11\r\n\
a=ssrc:110 mslabel:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU\r\n\
a=ssrc:110 label:29c336da-a4c0-4ae3-98c3-01dcb045ea11\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 101 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:/LqjwfEbqKQ3f3wD\r\n\
a=ice-pwd:rg4H+j0AEvnxp4Th847dGznM\r\n\
a=fingerprint:sha-256 ED:AD:B3:20:A5:E1:4A:A6:DB:7A:43:C3:E3:E0:25:47:CA:F9:51:C5:CE:96:DF:49:95:1F:A5:92:21:8A:77:56\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=x-google-flag:conference\r\n\
a=ssrc-group:SIM 121 122 123\r\n\
a=ssrc:121 cname:localVideo\r\n\
a=ssrc:121 msid:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc:121 mslabel:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU\r\n\
a=ssrc:121 label:e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc:122 cname:localVideo\r\n\
a=ssrc:122 msid:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc:122 mslabel:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU\r\n\
a=ssrc:122 label:e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc:123 cname:localVideo\r\n\
a=ssrc:123 msid:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc:123 mslabel:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU\r\n\
a=ssrc:123 label:e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc-group:FID 210 3110152606\r\n\
a=ssrc:210 cname:lwqoaa3WFMuYGqh8\r\n\
a=ssrc:210 msid:qCJz9KUv8my1ymOofvsnbuEty6dYudDtmZM3 3a9d80a8-0400-4d99-a1b4-7bd554555dea\r\n\
a=ssrc:210 mslabel:qCJz9KUv8my1ymOofvsnbuEty6dYudDtmZM3\r\n\
a=ssrc:210 label:3a9d80a8-0400-4d99-a1b4-7bd554555dea\r\n\
a=ssrc:3110152606 cname:lwqoaa3WFMuYGqh8\r\n\
a=ssrc:3110152606 msid:qCJz9KUv8my1ymOofvsnbuEty6dYudDtmZM3 3a9d80a8-0400-4d99-a1b4-7bd554555dea\r\n\
a=ssrc:3110152606 mslabel:qCJz9KUv8my1ymOofvsnbuEty6dYudDtmZM3\r\n\
a=ssrc:3110152606 label:3a9d80a8-0400-4d99-a1b4-7bd554555dea"

  /*jshint multistr: true */
  var expectedUnifiedPlan = /* The same but in line in different order */
   "v=0\r\n\
o=- 3154774635554078802 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-110 video-121 video-210\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=fmtp:111 minptime=10; useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:actpass\r\n\
a=mid:audio-110\r\n\
a=msid:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU 29c336da-a4c0-4ae3-98c3-01dcb045ea11\r\n\
a=maxptime:60\r\n\
a=sendonly\r\n\
a=ice-ufrag:/LqjwfEbqKQ3f3wD\r\n\
a=ice-pwd:rg4H+j0AEvnxp4Th847dGznM\r\n\
a=fingerprint:sha-256 ED:AD:B3:20:A5:E1:4A:A6:DB:7A:43:C3:E3:E0:25:47:CA:F9:51:C5:CE:96:DF:49:95:1F:A5:92:21:8A:77:56\r\n\
a=ssrc:110 cname:95qLJLELw6Trsslz\r\n\
a=ssrc:110 mslabel:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU\r\n\
a=ssrc:110 label:29c336da-a4c0-4ae3-98c3-01dcb045ea11\r\n\
a=rtcp-mux\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 101 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=setup:actpass\r\n\
a=mid:video-121\r\n\
a=msid:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=sendonly\r\n\
a=ice-ufrag:/LqjwfEbqKQ3f3wD\r\n\
a=ice-pwd:rg4H+j0AEvnxp4Th847dGznM\r\n\
a=fingerprint:sha-256 ED:AD:B3:20:A5:E1:4A:A6:DB:7A:43:C3:E3:E0:25:47:CA:F9:51:C5:CE:96:DF:49:95:1F:A5:92:21:8A:77:56\r\n\
a=ssrc:121 cname:localVideo\r\n\
a=ssrc:121 mslabel:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU\r\n\
a=ssrc:121 label:e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc:122 cname:localVideo\r\n\
a=ssrc:122 mslabel:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU\r\n\
a=ssrc:122 label:e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc:123 cname:localVideo\r\n\
a=ssrc:123 mslabel:SzwIW5b90m4nPQ5p0exZEvfNKYdLNdGMLRCU\r\n\
a=ssrc:123 label:e99f5ae5-287d-4664-a1ce-d3d0a7aa7e8d\r\n\
a=ssrc-group:SIM 121 122 123\r\n\
a=rtcp-mux\r\n\
a=x-google-flag:conference\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 101 116 117 96\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=setup:actpass\r\n\
a=mid:video-210\r\n\
a=msid:qCJz9KUv8my1ymOofvsnbuEty6dYudDtmZM3 3a9d80a8-0400-4d99-a1b4-7bd554555dea\r\n\
a=sendonly\r\n\
a=ice-ufrag:/LqjwfEbqKQ3f3wD\r\n\
a=ice-pwd:rg4H+j0AEvnxp4Th847dGznM\r\n\
a=fingerprint:sha-256 ED:AD:B3:20:A5:E1:4A:A6:DB:7A:43:C3:E3:E0:25:47:CA:F9:51:C5:CE:96:DF:49:95:1F:A5:92:21:8A:77:56\r\n\
a=ssrc:210 cname:lwqoaa3WFMuYGqh8\r\n\
a=ssrc:210 mslabel:qCJz9KUv8my1ymOofvsnbuEty6dYudDtmZM3\r\n\
a=ssrc:210 label:3a9d80a8-0400-4d99-a1b4-7bd554555dea\r\n\
a=ssrc:3110152606 cname:lwqoaa3WFMuYGqh8\r\n\
a=ssrc:3110152606 mslabel:qCJz9KUv8my1ymOofvsnbuEty6dYudDtmZM3\r\n\
a=ssrc:3110152606 label:3a9d80a8-0400-4d99-a1b4-7bd554555dea\r\n\
a=ssrc-group:FID 210 3110152606\r\n\
a=rtcp-mux\r\n\
a=x-google-flag:conference\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(offer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('ChromePlanB2UnifiedPlan_candidatesInSDP', function (assert) {
  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 3862893312234225166 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS 3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk\r\n\
m=audio 34602 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:58990 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 34602 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 58990 typ host generation 0 network-id 1\r\n\
a=ice-ufrag:ZtmGbKGNFUE3iWtz\r\n\
a=ice-pwd:dMaivy3qCrCoXp6k3YX8ZnId\r\n\
a=fingerprint:sha-256 BC:07:D0:07:AB:89:B8:40:C9:98:D9:85:B3:89:7A:43:12:A3:E7:F5:87:D8:7D:7A:8A:79:08:E1:81:01:E0:D7\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=maxptime:60\r\n\
a=ssrc:769766766 cname:cS2I7ANx344u/QaP\r\n\
a=ssrc:769766766 msid:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk 45755bd4-2dce-4fd4-91e9-68deb7dfb0ca\r\n\
a=ssrc:769766766 mslabel:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk\r\n\
a=ssrc:769766766 label:45755bd4-2dce-4fd4-91e9-68deb7dfb0ca\r\n\
m=video 47434 UDP/TLS/RTP/SAVPF 100 101 116 117 96 97 98\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:45205 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 47434 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 45205 typ host generation 0 network-id 1\r\n\
a=ice-ufrag:ZtmGbKGNFUE3iWtz\r\n\
a=ice-pwd:dMaivy3qCrCoXp6k3YX8ZnId\r\n\
a=fingerprint:sha-256 BC:07:D0:07:AB:89:B8:40:C9:98:D9:85:B3:89:7A:43:12:A3:E7:F5:87:D8:7D:7A:8A:79:08:E1:81:01:E0:D7\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtcp-rsize\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtpmap:97 rtx/90000\r\n\
a=fmtp:97 apt=101\r\n\
a=rtpmap:98 rtx/90000\r\n\
a=fmtp:98 apt=116\r\n\
a=ssrc-group:FID 4053998658 1160667626\r\n\
a=ssrc:4053998658 cname:cS2I7ANx344u/QaP\r\n\
a=ssrc:4053998658 msid:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk 9423c28d-fbdd-402b-a72a-a8a2fb81038b\r\n\
a=ssrc:4053998658 mslabel:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk\r\n\
a=ssrc:4053998658 label:9423c28d-fbdd-402b-a72a-a8a2fb81038b\r\n\
a=ssrc:1160667626 cname:cS2I7ANx344u/QaP\r\n\
a=ssrc:1160667626 msid:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk 9423c28d-fbdd-402b-a72a-a8a2fb81038b\r\n\
a=ssrc:1160667626 mslabel:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk\r\n\
a=ssrc:1160667626 label:9423c28d-fbdd-402b-a72a-a8a2fb81038b"

  /*jshint multistr: true */
  var expectedUnifiedPlan = /* The same but in line in different order */
   "v=0\r\n\
o=- 3862893312234225166 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-769766766 video-1160667626\r\n\
m=audio 34602 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:58990 IN IP4 193.147.51.57\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:actpass\r\n\
a=mid:audio-769766766\r\n\
a=msid:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk 45755bd4-2dce-4fd4-91e9-68deb7dfb0ca\r\n\
a=maxptime:60\r\n\
a=sendonly\r\n\
a=ice-ufrag:ZtmGbKGNFUE3iWtz\r\n\
a=ice-pwd:dMaivy3qCrCoXp6k3YX8ZnId\r\n\
a=fingerprint:sha-256 BC:07:D0:07:AB:89:B8:40:C9:98:D9:85:B3:89:7A:43:12:A3:E7:F5:87:D8:7D:7A:8A:79:08:E1:81:01:E0:D7\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 34602 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 58990 typ host generation 0\r\n\
a=ssrc:769766766 cname:cS2I7ANx344u/QaP\r\n\
a=ssrc:769766766 mslabel:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk\r\n\
a=ssrc:769766766 label:45755bd4-2dce-4fd4-91e9-68deb7dfb0ca\r\n\
a=rtcp-mux\r\n\
m=video 47434 UDP/TLS/RTP/SAVPF 100 101 116 117 96 97 98\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=rtpmap:97 rtx/90000\r\n\
a=rtpmap:98 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=fmtp:97 apt=101\r\n\
a=fmtp:98 apt=116\r\n\
a=rtcp:45205 IN IP4 193.147.51.57\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=setup:actpass\r\n\
a=mid:video-1160667626\r\n\
a=msid:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk 9423c28d-fbdd-402b-a72a-a8a2fb81038b\r\n\
a=sendonly\r\n\
a=ice-ufrag:ZtmGbKGNFUE3iWtz\r\n\
a=ice-pwd:dMaivy3qCrCoXp6k3YX8ZnId\r\n\
a=fingerprint:sha-256 BC:07:D0:07:AB:89:B8:40:C9:98:D9:85:B3:89:7A:43:12:A3:E7:F5:87:D8:7D:7A:8A:79:08:E1:81:01:E0:D7\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 34602 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 58990 typ host generation 0\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 47434 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 45205 typ host generation 0\r\n\
a=ssrc:1160667626 cname:cS2I7ANx344u/QaP\r\n\
a=ssrc:1160667626 mslabel:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk\r\n\
a=ssrc:1160667626 label:9423c28d-fbdd-402b-a72a-a8a2fb81038b\r\n\
a=ssrc:4053998658 cname:cS2I7ANx344u/QaP\r\n\
a=ssrc:4053998658 mslabel:3pf6ig1m2g8C9cgkvY8Zl5lch8x5944Bk8Xk\r\n\
a=ssrc:4053998658 label:9423c28d-fbdd-402b-a72a-a8a2fb81038b\r\n\
a=ssrc-group:FID 4053998658 1160667626\r\n\
a=rtcp-mux\r\n\
a=rtcp-rsize\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(offer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('ChromePlanB2UnifiedPlan_onlyAudioInactive', function (assert) {
  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 7114446378077337727 3 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS\r\n\
m=audio 41065 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:36617 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 41065 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 36617 typ host generation 0 network-id 1\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=ice-ufrag:jSCxmwgjp7Ds1Usv\r\n\
a=ice-pwd:Cxr8EFObBPv5rGmaHFk5dfmi\r\n\
a=fingerprint:sha-256 6E:97:09:BC:22:7B:DA:A3:5F:54:29:A4:7E:00:9E:0B:99:75:9D:7E:15:8C:81:D8:37:F6:B8:1B:74:0D:87:D7\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=maxptime:60"

  /*jshint multistr: true */
  var expectedUnifiedPlan = /* The same but in line in different order */
   "v=0\r\n\
o=- 7114446378077337727 3 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
m=audio 41065 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:36617 IN IP4 193.147.51.57\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=maxptime:60\r\n\
a=inactive\r\n\
a=ice-ufrag:jSCxmwgjp7Ds1Usv\r\n\
a=ice-pwd:Cxr8EFObBPv5rGmaHFk5dfmi\r\n\
a=fingerprint:sha-256 6E:97:09:BC:22:7B:DA:A3:5F:54:29:A4:7E:00:9E:0B:99:75:9D:7E:15:8C:81:D8:37:F6:B8:1B:74:0D:87:D7\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 41065 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 36617 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(offer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('UnifiedPlan2ChromePlanB_onlyAudioInactive', function (assert) {
  /*jshint multistr: true */
  var originUnifiedPlan =
   "v=0\r\n\
o=- 3673588160 3673588160 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=msid-semantic:WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=mid:audio-110\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=setup:active\r\n\
a=maxptime:60\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:9Jd3\r\n\
a=ice-pwd:tERhiaZaKKEI7C3y8R34C2\r\n\
a=fingerprint:sha-256 2D:24:14:87:01:CC:18:EB:5D:D9:42:DE:B7:3D:8F:3F:5F:C4:AF:9C:F5:8E:EE:6D:3B:A2:38:32:5E:F8:E2:F1"

  /*jshint multistr: true */
  var expectedPlanB = /* The same but in line in different order */
   "v=0\r\n\
o=- 3673588160 3673588160 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:audio\r\n\
a=maxptime:60\r\n\
a=inactive\r\n\
a=ice-ufrag:9Jd3\r\n\
a=ice-pwd:tERhiaZaKKEI7C3y8R34C2\r\n\
a=fingerprint:sha-256 2D:24:14:87:01:CC:18:EB:5D:D9:42:DE:B7:3D:8F:3F:5F:C4:AF:9C:F5:8E:EE:6D:3B:A2:38:32:5E:F8:E2:F1\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originUnifiedPlan
  });

  var planBDesc = interop.toPlanB(offer);
  assert.equal(planBDesc.sdp, expectedPlanB,
    "Not expected Unified Plan output")
});

QUnit.test('ChromePlanB2UnifiedPlan_AudioInactiveVideoInactive', function (assert) {
  /*jshint multistr: true */
  var originPlanB =
    "v=0\r\n\
o=- 197622061721370541 4 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS\r\n\
m=audio 58211 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:57907 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 58211 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 57907 typ host generation 0 network-id 1\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=ice-ufrag:6UB50tgyuARU3ODC\r\n\
a=ice-pwd:nr4yGuBShKnruIrkzuiIHsV8\r\n\
a=fingerprint:sha-256 87:1D:58:F3:DF:84:94:13:3F:20:68:91:AE:F8:81:EF:BF:AB:B3:93:65:04:3A:35:0D:E5:A3:A3:E8:41:8E:60\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=maxptime:60\r\n\
m=video 52201 UDP/TLS/RTP/SAVPF 100 101 116 117 96 97 98\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:37017 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 52201 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 37017 typ host generation 0 network-id 1\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=ice-ufrag:6UB50tgyuARU3ODC\r\n\
a=ice-pwd:nr4yGuBShKnruIrkzuiIHsV8\r\n\
a=fingerprint:sha-256 87:1D:58:F3:DF:84:94:13:3F:20:68:91:AE:F8:81:EF:BF:AB:B3:93:65:04:3A:35:0D:E5:A3:A3:E8:41:8E:60\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=inactive\r\n\
a=rtcp-mux\r\n\
a=rtcp-rsize\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtpmap:97 rtx/90000\r\n\
a=fmtp:97 apt=101\r\n\
a=rtpmap:98 rtx/90000\r\n\
a=fmtp:98 apt=116"

  /*jshint multistr: true */
  var expectedUnifiedPlan = /* The same but in line in different order */
   "v=0\r\n\
o=- 197622061721370541 4 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
m=audio 58211 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:57907 IN IP4 193.147.51.57\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=maxptime:60\r\n\
a=inactive\r\n\
a=ice-ufrag:6UB50tgyuARU3ODC\r\n\
a=ice-pwd:nr4yGuBShKnruIrkzuiIHsV8\r\n\
a=fingerprint:sha-256 87:1D:58:F3:DF:84:94:13:3F:20:68:91:AE:F8:81:EF:BF:AB:B3:93:65:04:3A:35:0D:E5:A3:A3:E8:41:8E:60\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 58211 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 57907 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=rtcp-mux\r\n\
m=video 52201 UDP/TLS/RTP/SAVPF 100 101 116 117 96 97 98\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=rtpmap:97 rtx/90000\r\n\
a=rtpmap:98 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=fmtp:97 apt=101\r\n\
a=fmtp:98 apt=116\r\n\
a=rtcp:37017 IN IP4 193.147.51.57\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=inactive\r\n\
a=ice-ufrag:6UB50tgyuARU3ODC\r\n\
a=ice-pwd:nr4yGuBShKnruIrkzuiIHsV8\r\n\
a=fingerprint:sha-256 87:1D:58:F3:DF:84:94:13:3F:20:68:91:AE:F8:81:EF:BF:AB:B3:93:65:04:3A:35:0D:E5:A3:A3:E8:41:8E:60\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 58211 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 57907 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 52201 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 37017 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=rtcp-mux\r\n\
a=rtcp-rsize\r\n"

  var interop = new Interop();

  var offer = new RTCSessionDescription({
    type: 'offer',
    sdp: originPlanB
  });

  var unifiedPlanDesc = interop.toUnifiedPlan(offer);
  assert.equal(unifiedPlanDesc.sdp, expectedUnifiedPlan,
    "Not expected Unified Plan output")
});

QUnit.test('UnifiedPlan2ChromePlanB_firstVideo', function (assert) {
  /*jshint multistr: true */
  var originUnifiedPlan =
    "v=0\r\n\
o=- 3675409372 3675409372 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE video-100011 video-200021 audio-200010\r\n\
a=msid-semantic:WMS *\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=mid:video-100011\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:j2n/\r\n\
a=ice-pwd:eYri13NefF6UTt4wO79o+M\r\n\
a=fingerprint:sha-256 8B:4E:1B:F1:D3:B6:0D:49:7E:CE:C8:B6:73:3A:8A:47:DA:31:8B:6E:5A:F8:3B:C4:B0:D5:E0:29:2E:02:48:81\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=mid:video-200021\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:j2n/\r\n\
a=ice-pwd:eYri13NefF6UTt4wO79o+M\r\n\
a=fingerprint:sha-256 8B:4E:1B:F1:D3:B6:0D:49:7E:CE:C8:B6:73:3A:8A:47:DA:31:8B:6E:5A:F8:3B:C4:B0:D5:E0:29:2E:02:48:81\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=mid:audio-200010\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:j2n/\r\n\
a=ice-pwd:eYri13NefF6UTt4wO79o+M\r\n\
a=fingerprint:sha-256 8B:4E:1B:F1:D3:B6:0D:49:7E:CE:C8:B6:73:3A:8A:47:DA:31:8B:6E:5A:F8:3B:C4:B0:D5:E0:29:2E:02:48:81"

  /*jshint multistr: true */
  var expectedPlanB = /* The same but in line in different order */
   "v=0\r\n\
o=- 3675409372 3675409372 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE video audio\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:video\r\n\
a=recvonly\r\n\
a=ice-ufrag:j2n/\r\n\
a=ice-pwd:eYri13NefF6UTt4wO79o+M\r\n\
a=fingerprint:sha-256 8B:4E:1B:F1:D3:B6:0D:49:7E:CE:C8:B6:73:3A:8A:47:DA:31:8B:6E:5A:F8:3B:C4:B0:D5:E0:29:2E:02:48:81\r\n\
a=rtcp-mux\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:audio\r\n\
a=recvonly\r\n\
a=ice-ufrag:j2n/\r\n\
a=ice-pwd:eYri13NefF6UTt4wO79o+M\r\n\
a=fingerprint:sha-256 8B:4E:1B:F1:D3:B6:0D:49:7E:CE:C8:B6:73:3A:8A:47:DA:31:8B:6E:5A:F8:3B:C4:B0:D5:E0:29:2E:02:48:81\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var answer = new RTCSessionDescription({
    type: 'answer',
    sdp: originUnifiedPlan
  });

  var planBDesc = interop.toPlanB(answer);
  assert.equal(planBDesc.sdp, expectedPlanB,
    "Not expected Unified Plan output")
});

QUnit.test('UnifiedPlan2ChromePlanB_firstVideoEvenInactive', function (assert) {
  /*jshint multistr: true */
  var originUnifiedPlan =
    "v=0\r\n\
o=- 3676179310 3676179310 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE video-100011 video-200021 audio-200010 video\r\n\
a=msid-semantic:WMS *\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=mid:video-100011\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:JzB/\r\n\
a=ice-pwd:/0HZp7IXWgvqVXVAKnWsKd\r\n\
a=fingerprint:sha-256 20:32:A2:09:EC:35:F0:C4:7E:03:A2:79:66:DA:74:8C:4A:9D:37:71:AA:60:81:A1:F3:80:F2:8B:E3:80:13:D4\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=mid:video-200021\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:JzB/\r\n\
a=ice-pwd:/0HZp7IXWgvqVXVAKnWsKd\r\n\
a=fingerprint:sha-256 20:32:A2:09:EC:35:F0:C4:7E:03:A2:79:66:DA:74:8C:4A:9D:37:71:AA:60:81:A1:F3:80:F2:8B:E3:80:13:D4\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=mid:audio-200010\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:JzB/\r\n\
a=ice-pwd:/0HZp7IXWgvqVXVAKnWsKd\r\n\
a=fingerprint:sha-256 20:32:A2:09:EC:35:F0:C4:7E:03:A2:79:66:DA:74:8C:4A:9D:37:71:AA:60:81:A1:F3:80:F2:8B:E3:80:13:D4\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=mid:video\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:JzB/\r\n\
a=ice-pwd:/0HZp7IXWgvqVXVAKnWsKd\r\n\
a=fingerprint:sha-256 20:32:A2:09:EC:35:F0:C4:7E:03:A2:79:66:DA:74:8C:4A:9D:37:71:AA:60:81:A1:F3:80:F2:8B:E3:80:13:D4"

  /*jshint multistr: true */
  var expectedPlanB =
   "v=0\r\n\
o=- 3676179310 3676179310 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE video audio\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:video\r\n\
a=inactive\r\n\
a=ice-ufrag:JzB/\r\n\
a=ice-pwd:/0HZp7IXWgvqVXVAKnWsKd\r\n\
a=fingerprint:sha-256 20:32:A2:09:EC:35:F0:C4:7E:03:A2:79:66:DA:74:8C:4A:9D:37:71:AA:60:81:A1:F3:80:F2:8B:E3:80:13:D4\r\n\
a=rtcp-mux\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:audio\r\n\
a=recvonly\r\n\
a=ice-ufrag:JzB/\r\n\
a=ice-pwd:/0HZp7IXWgvqVXVAKnWsKd\r\n\
a=fingerprint:sha-256 20:32:A2:09:EC:35:F0:C4:7E:03:A2:79:66:DA:74:8C:4A:9D:37:71:AA:60:81:A1:F3:80:F2:8B:E3:80:13:D4\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var answer = new RTCSessionDescription({
    type: 'answer',
    sdp: originUnifiedPlan
  });

  var planBDesc = interop.toPlanB(answer);
  assert.equal(planBDesc.sdp, expectedPlanB,
    "Not expected Unified Plan output")
});

QUnit.test('UnifiedPlan2ChromePlanB_firstInactiveAudio', function (assert) {
  /*jshint multistr: true */
  var originUnifiedPlan =
    "v=0\r\n\
o=- 3675422641 3675422641 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-100010 video-100021 audio\r\n\
a=msid-semantic:WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=mid:audio-100010\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:9QP6\r\n\
a=ice-pwd:AmTmxrNEP6hNJ58MFX7cP6\r\n\
a=fingerprint:sha-256 C7:38:BF:5C:84:29:8A:7D:97:51:90:D6:51:93:69:E1:3B:B8:59:C6:B1:23:F5:FF:EC:03:CE:D5:AB:77:96:52\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=mid:video-100021\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:9QP6\r\n\
a=ice-pwd:AmTmxrNEP6hNJ58MFX7cP6\r\n\
a=fingerprint:sha-256 C7:38:BF:5C:84:29:8A:7D:97:51:90:D6:51:93:69:E1:3B:B8:59:C6:B1:23:F5:FF:EC:03:CE:D5:AB:77:96:52\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=inactive\r\n\
a=mid:audio\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:9QP6\r\n\
a=ice-pwd:AmTmxrNEP6hNJ58MFX7cP6\r\n\
a=fingerprint:sha-256 C7:38:BF:5C:84:29:8A:7D:97:51:90:D6:51:93:69:E1:3B:B8:59:C6:B1:23:F5:FF:EC:03:CE:D5:AB:77:96:52"

  /*jshint multistr: true */
  var expectedPlanB = /* The same but in line in different order */
   "v=0\r\n\
o=- 3675422641 3675422641 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio video\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:audio\r\n\
a=inactive\r\n\
a=ice-ufrag:9QP6\r\n\
a=ice-pwd:AmTmxrNEP6hNJ58MFX7cP6\r\n\
a=fingerprint:sha-256 C7:38:BF:5C:84:29:8A:7D:97:51:90:D6:51:93:69:E1:3B:B8:59:C6:B1:23:F5:FF:EC:03:CE:D5:AB:77:96:52\r\n\
a=rtcp-mux\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=setup:active\r\n\
a=mid:video\r\n\
a=recvonly\r\n\
a=ice-ufrag:9QP6\r\n\
a=ice-pwd:AmTmxrNEP6hNJ58MFX7cP6\r\n\
a=fingerprint:sha-256 C7:38:BF:5C:84:29:8A:7D:97:51:90:D6:51:93:69:E1:3B:B8:59:C6:B1:23:F5:FF:EC:03:CE:D5:AB:77:96:52\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var answer = new RTCSessionDescription({
    type: 'answer',
    sdp: originUnifiedPlan
  });

  var planBDesc = interop.toPlanB(answer);
  assert.equal(planBDesc.sdp, expectedPlanB,
    "Not expected Unified Plan output")
});

QUnit.test('ChromePlanB2UnifiedPlan_AnswerWithLocalSsrcs', function (assert) {
  /*jshint multistr: true */
  var planBOfferSdp1 =
    "v=0\r\n\
o=- 7070828884330349403 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS 9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:4Dm6q/YO1LsTej1D\r\n\
a=ice-pwd:yzcIbm21Ot4Z37ZH+7PZdR9g\r\n\
a=fingerprint:sha-256 90:90:D0:35:19:42:F2:A4:FE:5E:97:E0:CB:44:9A:84:B7:A8:B1:12:3E:9C:88:0B:B2:0D:0C:79:F7:3B:97:19\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=ssrc:100010 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:100010 msid:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j 1edc838e-fc27-42e5-8965-94cc63fc31e5\r\n\
a=ssrc:100010 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:100010 label:1edc838e-fc27-42e5-8965-94cc63fc31e5\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 101 107 116 117 96 97 99 98\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:4Dm6q/YO1LsTej1D\r\n\
a=ice-pwd:yzcIbm21Ot4Z37ZH+7PZdR9g\r\n\
a=fingerprint:sha-256 90:90:D0:35:19:42:F2:A4:FE:5E:97:E0:CB:44:9A:84:B7:A8:B1:12:3E:9C:88:0B:B2:0D:0C:79:F7:3B:97:19\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtcp-rsize\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=rtpmap:107 H264/90000\r\n\
a=rtcp-fb:107 ccm fir\r\n\
a=rtcp-fb:107 nack\r\n\
a=rtcp-fb:107 nack pli\r\n\
a=rtcp-fb:107 goog-remb\r\n\
a=rtcp-fb:107 transport-cc\r\n\
a=fmtp:107 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtpmap:97 rtx/90000\r\n\
a=fmtp:97 apt=101\r\n\
a=rtpmap:99 rtx/90000\r\n\
a=fmtp:99 apt=107\r\n\
a=rtpmap:98 rtx/90000\r\n\
a=fmtp:98 apt=116\r\n\
a=ssrc-group:FID 100020 1248340805\r\n\
a=ssrc:100020 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:100020 msid:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j 25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n\
a=ssrc:100020 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:100020 label:25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n\
a=ssrc:1248340805 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:1248340805 msid:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j 25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n\
a=ssrc:1248340805 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:1248340805 label:25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n"

  /*jshint multistr: true */
  var unifiedPlanAnswerSdp1 =
   "v=0\r\n\
o=- 3675750821 3675750821 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-100010 video-100020\r\n\
a=msid-semantic:WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=mid:audio-100010\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:enKf\r\n\
a=ice-pwd:jETXB0lJHY3cTFWdOUnxwa\r\n\
a=fingerprint:sha-256 AB:FF:34:6A:94:D9:78:D8:DD:5E:F6:4B:48:0C:CF:0F:67:32:1D:93:E3:2E:6F:C8:4F:4C:8F:86:68:FE:3C:9B\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=mid:video-100020\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:enKf\r\n\
a=ice-pwd:jETXB0lJHY3cTFWdOUnxwa\r\n\
a=fingerprint:sha-256 AB:FF:34:6A:94:D9:78:D8:DD:5E:F6:4B:48:0C:CF:0F:67:32:1D:93:E3:2E:6F:C8:4F:4C:8F:86:68:FE:3C:9B\r\n"

  /*jshint multistr: true */
  var unifiedPlanOfferSdp2 =
   "v=0\r\n\
o=- 3675750821 3675750822 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=group:BUNDLE audio-100010 video-100020\r\n\
a=msid-semantic:WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=sendrecv\r\n\
a=ssrc:620419814 cname:user2667131133@host-aa4cc307\r\n\
a=ssrc:620419814 msid:default 94a8bd6b-f891-48ba-8eca-52e6e6531f66\r\n\
a=ssrc:620419814 mslabel:default\r\n\
a=ssrc:620419814 label:94a8bd6b-f891-48ba-8eca-52e6e6531f66\r\n\
a=mid:audio-100010\r\n\
a=ice-ufrag:enKf\r\n\
a=ice-pwd:jETXB0lJHY3cTFWdOUnxwa\r\n\
a=fingerprint:sha-256 AB:FF:34:6A:94:D9:78:D8:DD:5E:F6:4B:48:0C:CF:0F:67:32:1D:93:E3:2E:6F:C8:4F:4C:8F:86:68:FE:3C:9B\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=sendrecv\r\n\
a=ssrc:71964023 cname:user2667131133@host-aa4cc307\r\n\
a=ssrc:71964023 msid:default 79124455-420a-4c3f-b715-95f94e3bcfc4\r\n\
a=ssrc:71964023 mslabel:default\r\n\
a=ssrc:71964023 label:79124455-420a-4c3f-b715-95f94e3bcfc4\r\n\
a=mid:video-100020\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=ice-ufrag:enKf\r\n\
a=ice-pwd:jETXB0lJHY3cTFWdOUnxwa\r\n\
a=fingerprint:sha-256 AB:FF:34:6A:94:D9:78:D8:DD:5E:F6:4B:48:0C:CF:0F:67:32:1D:93:E3:2E:6F:C8:4F:4C:8F:86:68:FE:3C:9B\r\n"

  /*jshint multistr: true */
  var planBAnswerSdp2 =
   "v=0\r\n\
o=- 7070828884330349403 3 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS 9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
m=audio 40676 UDP/TLS/RTP/SAVPF 111 0\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:53342 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 40676 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 53342 typ host generation 0 network-id 1\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=ice-ufrag:4Dm6q/YO1LsTej1D\r\n\
a=ice-pwd:yzcIbm21Ot4Z37ZH+7PZdR9g\r\n\
a=fingerprint:sha-256 90:90:D0:35:19:42:F2:A4:FE:5E:97:E0:CB:44:9A:84:B7:A8:B1:12:3E:9C:88:0B:B2:0D:0C:79:F7:3B:97:19\r\n\
a=setup:passive\r\n\
a=mid:audio\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=ssrc:100010 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:100010 msid:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j 1edc838e-fc27-42e5-8965-94cc63fc31e5\r\n\
a=ssrc:100010 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:100010 label:1edc838e-fc27-42e5-8965-94cc63fc31e5\r\n\
m=video 59573 UDP/TLS/RTP/SAVPF 100\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:48977 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 59573 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 48977 typ host generation 0 network-id 1\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=ice-ufrag:4Dm6q/YO1LsTej1D\r\n\
a=ice-pwd:yzcIbm21Ot4Z37ZH+7PZdR9g\r\n\
a=fingerprint:sha-256 90:90:D0:35:19:42:F2:A4:FE:5E:97:E0:CB:44:9A:84:B7:A8:B1:12:3E:9C:88:0B:B2:0D:0C:79:F7:3B:97:19\r\n\
a=setup:passive\r\n\
a=mid:video\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=ssrc-group:FID 100020 1248340805\r\n\
a=ssrc:100020 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:100020 msid:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j 25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n\
a=ssrc:100020 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:100020 label:25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n\
a=ssrc:1248340805 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:1248340805 msid:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j 25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n\
a=ssrc:1248340805 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:1248340805 label:25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n"

  /*jshint multistr: true */
  var expectedunifiedPlanAnswerSdp2 = /* The same but in line in different order */
   "v=0\r\n\
o=- 7070828884330349403 3 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-100010 video-100020\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:audio-100010\r\n\
a=sendrecv\r\n\
a=ice-ufrag:4Dm6q/YO1LsTej1D\r\n\
a=ice-pwd:yzcIbm21Ot4Z37ZH+7PZdR9g\r\n\
a=fingerprint:sha-256 90:90:D0:35:19:42:F2:A4:FE:5E:97:E0:CB:44:9A:84:B7:A8:B1:12:3E:9C:88:0B:B2:0D:0C:79:F7:3B:97:19\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 40676 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 53342 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 59573 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 48977 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=ssrc:100010 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:100010 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:100010 label:1edc838e-fc27-42e5-8965-94cc63fc31e5\r\n\
a=rtcp-mux\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:video-100020\r\n\
a=sendrecv\r\n\
a=ice-ufrag:4Dm6q/YO1LsTej1D\r\n\
a=ice-pwd:yzcIbm21Ot4Z37ZH+7PZdR9g\r\n\
a=fingerprint:sha-256 90:90:D0:35:19:42:F2:A4:FE:5E:97:E0:CB:44:9A:84:B7:A8:B1:12:3E:9C:88:0B:B2:0D:0C:79:F7:3B:97:19\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 40676 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 53342 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 59573 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 48977 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=ssrc:100020 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:100020 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:100020 label:25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n\
a=ssrc:1248340805 cname:179RXfqT25NlVGkj\r\n\
a=ssrc:1248340805 mslabel:9RejlsRUuFgz8gOE37ErNVk9DfJMyNlLgK4j\r\n\
a=ssrc:1248340805 label:25256b1a-5672-44ec-858f-fe4f1a1d2ba6\r\n\
a=rtcp-mux\r\n\
"

  var interop = new Interop();

  var planBOffer1 = new RTCSessionDescription({
    type: 'offer',
    sdp: planBOfferSdp1
  });
  var unifedPlanOffer1 = interop.toUnifiedPlan(planBOffer1);

  var unifiedPlanAnswer1 = new RTCSessionDescription({
    type: 'answer',
    sdp: unifiedPlanAnswerSdp1
  });
  var planBAnswer1 = interop.toPlanB(unifiedPlanAnswer1);

  var unifiedPlanOffer2 = new RTCSessionDescription({
    type: 'offer',
    sdp: unifiedPlanOfferSdp2
  });
  var planBOffer2 = interop.toPlanB(unifiedPlanOffer2);

  var planBAnswer2 = new RTCSessionDescription({
    type: 'answer',
    sdp: planBAnswerSdp2
  });
  var unifiedPlanAnswer2 = interop.toUnifiedPlan(planBAnswer2);

  assert.equal(unifiedPlanAnswer2.sdp, expectedunifiedPlanAnswerSdp2,
    "Not expected Unified Plan output")
});

QUnit.test('ChromePlanB2UnifiedPlan_AnswerProperDirection', function (assert) {
  /*jshint multistr: true */
  var planBOfferSdp1 =
    "v=0\r\n\
o=- 2238083093953519917 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:jkrbWVZww4TbaCbE\r\n\
a=ice-pwd:deEHgByrp588V2yqyh588Tkg\r\n\
a=fingerprint:sha-256 7F:F6:8E:9D:1A:EF:C2:9F:27:08:C4:77:39:2D:D4:DC:4E:37:DC:AB:A2:8C:6A:F4:05:48:5A:A3:9F:3F:FF:43\r\n\
a=setup:actpass\r\n\
a=mid:audio\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=ssrc:100010 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:100010 msid:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8 7b1c4e9c-a7f3-42fa-9e91-3ede90c706e1\r\n\
a=ssrc:100010 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:100010 label:7b1c4e9c-a7f3-42fa-9e91-3ede90c706e1\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 100 101 107 116 117 96 97 99 98\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:jkrbWVZww4TbaCbE\r\n\
a=ice-pwd:deEHgByrp588V2yqyh588Tkg\r\n\
a=fingerprint:sha-256 7F:F6:8E:9D:1A:EF:C2:9F:27:08:C4:77:39:2D:D4:DC:4E:37:DC:AB:A2:8C:6A:F4:05:48:5A:A3:9F:3F:FF:43\r\n\
a=setup:actpass\r\n\
a=mid:video\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtcp-rsize\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtpmap:101 VP9/90000\r\n\
a=rtcp-fb:101 ccm fir\r\n\
a=rtcp-fb:101 nack\r\n\
a=rtcp-fb:101 nack pli\r\n\
a=rtcp-fb:101 goog-remb\r\n\
a=rtcp-fb:101 transport-cc\r\n\
a=rtpmap:107 H264/90000\r\n\
a=rtcp-fb:107 ccm fir\r\n\
a=rtcp-fb:107 nack\r\n\
a=rtcp-fb:107 nack pli\r\n\
a=rtcp-fb:107 goog-remb\r\n\
a=rtcp-fb:107 transport-cc\r\n\
a=fmtp:107 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\n\
a=rtpmap:116 red/90000\r\n\
a=rtpmap:117 ulpfec/90000\r\n\
a=rtpmap:96 rtx/90000\r\n\
a=fmtp:96 apt=100\r\n\
a=rtpmap:97 rtx/90000\r\n\
a=fmtp:97 apt=101\r\n\
a=rtpmap:99 rtx/90000\r\n\
a=fmtp:99 apt=107\r\n\
a=rtpmap:98 rtx/90000\r\n\
a=fmtp:98 apt=116\r\n\
a=ssrc-group:FID 100020 2546225066\r\n\
a=ssrc:100020 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:100020 msid:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8 e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n\
a=ssrc:100020 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:100020 label:e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n\
a=ssrc:2546225066 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:2546225066 msid:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8 e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n\
a=ssrc:2546225066 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:2546225066 label:e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n"

  /*jshint multistr: true */
  var unifiedPlanAnswerSdp1 =
   "v=0\r\n\
o=- 3676105346 3676105346 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-100010 video-100020\r\n\
a=msid-semantic:WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=mid:audio-100010\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:TZvf\r\n\
a=ice-pwd:UBli2hjQzF17DcrxlRjpZp\r\n\
a=fingerprint:sha-256 A8:F3:19:6D:06:A3:4A:43:36:A7:53:85:1A:A4:D2:BD:E9:3B:E8:31:92:42:4C:B4:4F:A0:05:7D:88:27:FA:0E\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=recvonly\r\n\
a=mid:video-100020\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=setup:active\r\n\
a=rtcp-mux\r\n\
a=ice-ufrag:TZvf\r\n\
a=ice-pwd:UBli2hjQzF17DcrxlRjpZp\r\n\
a=fingerprint:sha-256 A8:F3:19:6D:06:A3:4A:43:36:A7:53:85:1A:A4:D2:BD:E9:3B:E8:31:92:42:4C:B4:4F:A0:05:7D:88:27:FA:0E\r\n"

  /*jshint multistr: true */
  var unifiedPlanOfferSdp2 =
   "v=0\r\n\
o=- 3676105346 3676105347 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=group:BUNDLE audio-100010 video-100020\r\n\
a=msid-semantic:WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=recvonly\r\n\
a=mid:audio-100010\r\n\
a=ice-ufrag:TZvf\r\n\
a=ice-pwd:UBli2hjQzF17DcrxlRjpZp\r\n\
a=fingerprint:sha-256 A8:F3:19:6D:06:A3:4A:43:36:A7:53:85:1A:A4:D2:BD:E9:3B:E8:31:92:42:4C:B4:4F:A0:05:7D:88:27:FA:0E\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=sendrecv\r\n\
a=ssrc:929408834 cname:user1241408480@host-2f0a2c5d\r\n\
a=ssrc:929408834 msid:AAAAAAAAAAAAAAAAAAAAAAAAAAA 18908003-4c43-41a8-b90e-75ff3de903e0\r\n\
a=ssrc:929408834 mslabel:AAAAAAAAAAAAAAAAAAAAAAAAAAA\r\n\
a=ssrc:929408834 label:18908003-4c43-41a8-b90e-75ff3de903e0\r\n\
a=mid:video-100020\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=ice-ufrag:TZvf\r\n\
a=ice-pwd:UBli2hjQzF17DcrxlRjpZp\r\n\
a=fingerprint:sha-256 A8:F3:19:6D:06:A3:4A:43:36:A7:53:85:1A:A4:D2:BD:E9:3B:E8:31:92:42:4C:B4:4F:A0:05:7D:88:27:FA:0E\r\n"

  /*jshint multistr: true */
  var planBAnswerSdp2 =
   "v=0\r\n\
o=- 2238083093953519917 3 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE audio video\r\n\
a=msid-semantic: WMS uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
m=audio 54934 UDP/TLS/RTP/SAVPF 111 0\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:56692 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 54934 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 56692 typ host generation 0 network-id 1\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=ice-ufrag:jkrbWVZww4TbaCbE\r\n\
a=ice-pwd:deEHgByrp588V2yqyh588Tkg\r\n\
a=fingerprint:sha-256 7F:F6:8E:9D:1A:EF:C2:9F:27:08:C4:77:39:2D:D4:DC:4E:37:DC:AB:A2:8C:6A:F4:05:48:5A:A3:9F:3F:FF:43\r\n\
a=setup:passive\r\n\
a=mid:audio\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendonly\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=ssrc:100010 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:100010 msid:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8 7b1c4e9c-a7f3-42fa-9e91-3ede90c706e1\r\n\
a=ssrc:100010 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:100010 label:7b1c4e9c-a7f3-42fa-9e91-3ede90c706e1\r\n\
m=video 60335 UDP/TLS/RTP/SAVPF 100\r\n\
c=IN IP4 193.147.51.57\r\n\
a=rtcp:47725 IN IP4 193.147.51.57\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 60335 typ host generation 0 network-id 1\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 47725 typ host generation 0 network-id 1\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0 network-id 1\r\n\
a=ice-ufrag:jkrbWVZww4TbaCbE\r\n\
a=ice-pwd:deEHgByrp588V2yqyh588Tkg\r\n\
a=fingerprint:sha-256 7F:F6:8E:9D:1A:EF:C2:9F:27:08:C4:77:39:2D:D4:DC:4E:37:DC:AB:A2:8C:6A:F4:05:48:5A:A3:9F:3F:FF:43\r\n\
a=setup:passive\r\n\
a=mid:video\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=sendrecv\r\n\
a=rtcp-mux\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=ssrc-group:FID 100020 2546225066\r\n\
a=ssrc:100020 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:100020 msid:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8 e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n\
a=ssrc:100020 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:100020 label:e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n\
a=ssrc:2546225066 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:2546225066 msid:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8 e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n\
a=ssrc:2546225066 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:2546225066 label:e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n"

  /*jshint multistr: true */
  var expectedunifiedPlanAnswerSdp2 = /* The same but in line in different order */
   "v=0\r\n\
o=- 2238083093953519917 3 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=msid-semantic: WMS *\r\n\
a=group:BUNDLE audio-100010 video-100020\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:audio-100010\r\n\
a=sendonly\r\n\
a=ice-ufrag:jkrbWVZww4TbaCbE\r\n\
a=ice-pwd:deEHgByrp588V2yqyh588Tkg\r\n\
a=fingerprint:sha-256 7F:F6:8E:9D:1A:EF:C2:9F:27:08:C4:77:39:2D:D4:DC:4E:37:DC:AB:A2:8C:6A:F4:05:48:5A:A3:9F:3F:FF:43\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 54934 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 56692 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 60335 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 47725 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=ssrc:100010 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:100010 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:100010 label:7b1c4e9c-a7f3-42fa-9e91-3ede90c706e1\r\n\
a=rtcp-mux\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=mid:video-100020\r\n\
a=sendrecv\r\n\
a=ice-ufrag:jkrbWVZww4TbaCbE\r\n\
a=ice-pwd:deEHgByrp588V2yqyh588Tkg\r\n\
a=fingerprint:sha-256 7F:F6:8E:9D:1A:EF:C2:9F:27:08:C4:77:39:2D:D4:DC:4E:37:DC:AB:A2:8C:6A:F4:05:48:5A:A3:9F:3F:FF:43\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 54934 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 56692 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:900116024 1 udp 2122260223 193.147.51.57 60335 typ host generation 0\r\n\
a=candidate:900116024 2 udp 2122260222 193.147.51.57 47725 typ host generation 0\r\n\
a=candidate:2066043592 1 tcp 1518280447 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=candidate:2066043592 2 tcp 1518280446 193.147.51.57 9 typ host tcptype active generation 0\r\n\
a=ssrc:100020 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:100020 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:100020 label:e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n\
a=ssrc:2546225066 cname:8uIW1s38t/uk6dRD\r\n\
a=ssrc:2546225066 mslabel:uYcXoXV32TUQfDEmjbDOlv5oQ8zlpgBAmiv8\r\n\
a=ssrc:2546225066 label:e0e595ca-b3ce-47b8-89e1-fb18ba98e7ad\r\n\
a=rtcp-mux\r\n"

  var interop = new Interop();

  var planBOffer1 = new RTCSessionDescription({
    type: 'offer',
    sdp: planBOfferSdp1
  });
  var unifedPlanOffer1 = interop.toUnifiedPlan(planBOffer1);

  var unifiedPlanAnswer1 = new RTCSessionDescription({
    type: 'answer',
    sdp: unifiedPlanAnswerSdp1
  });
  var planBAnswer1 = interop.toPlanB(unifiedPlanAnswer1);

  var unifiedPlanOffer2 = new RTCSessionDescription({
    type: 'offer',
    sdp: unifiedPlanOfferSdp2
  });
  var planBOffer2 = interop.toPlanB(unifiedPlanOffer2);

  var planBAnswer2 = new RTCSessionDescription({
    type: 'answer',
    sdp: planBAnswerSdp2
  });
  var unifiedPlanAnswer2 = interop.toUnifiedPlan(planBAnswer2);

  assert.equal(unifiedPlanAnswer2.sdp, expectedunifiedPlanAnswerSdp2,
    "Not expected Unified Plan output")
});

QUnit.test('RaiseExceptionWhenProtocolsAreDifferent', function (assert) {
  /*jshint multistr: true */
  var unifiedPlanDifferentPt = "v=0\r\n\
o=- 3676259274 3676259276 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=group:BUNDLE audio-100010 video-100020 audio0 video0\r\n\
a=msid-semantic:WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=sendrecv\r\n\
a=ssrc:3473898950 cname:user1930265166@host-2694e0c5\r\n\
a=ssrc:3473898950 msid:default 3d066e9d-7049-42f0-88a0-deca96228e20\r\n\
a=ssrc:3473898950 mslabel:default\r\n\
a=ssrc:3473898950 label:3d066e9d-7049-42f0-88a0-deca96228e20\r\n\
a=mid:audio-100010\r\n\
a=ice-ufrag:55G8\r\n\
a=ice-pwd:NQSO/WCpPhX7MNsY0FTbJ9\r\n\
a=fingerprint:sha-256 72:48:E7:59:69:47:15:F5:85:A9:58:9E:CD:65:91:AE:59:F1:8C:57:8A:43:9E:08:99:22:7F:08:2D:68:A5:BB\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=sendrecv\r\n\
a=ssrc:2206541536 cname:user1930265166@host-2694e0c5\r\n\
a=ssrc:2206541536 msid:default ad836b97-b117-45a3-8faa-bf2de2801b2d\r\n\
a=ssrc:2206541536 mslabel:default\r\n\
a=ssrc:2206541536 label:ad836b97-b117-45a3-8faa-bf2de2801b2d\r\n\
a=mid:video-100020\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=ice-ufrag:55G8\r\n\
a=ice-pwd:NQSO/WCpPhX7MNsY0FTbJ9\r\n\
a=fingerprint:sha-256 72:48:E7:59:69:47:15:F5:85:A9:58:9E:CD:65:91:AE:59:F1:8C:57:8A:43:9E:08:99:22:7F:08:2D:68:A5:BB\r\n\
m=audio 1 RTP/SAVPF 96 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=mid:audio0\r\n\
a=sendrecv\r\n\
a=ssrc:3553187867 cname:user1930265166@host-2694e0c5\r\n\
a=ssrc:3553187867 msid:Zo9ShgFMRP1qHcHauC5vG53apc6wJyEdMaNE fc6b975c-ae86-41ae-9c7a-0ab64e8dc2f5\r\n\
a=ssrc:3553187867 mslabel:Zo9ShgFMRP1qHcHauC5vG53apc6wJyEdMaNE\r\n\
a=ssrc:3553187867 label:fc6b975c-ae86-41ae-9c7a-0ab64e8dc2f5\r\n\
a=ice-ufrag:55G8\r\n\
a=ice-pwd:NQSO/WCpPhX7MNsY0FTbJ9\r\n\
a=fingerprint:sha-256 72:48:E7:59:69:47:15:F5:85:A9:58:9E:CD:65:91:AE:59:F1:8C:57:8A:43:9E:08:99:22:7F:08:2D:68:A5:BB\r\n\
m=video 1 RTP/SAVPF 97\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:97 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=mid:video0\r\n\
a=sendrecv\r\n\
a=ssrc:2245113309 cname:user1930265166@host-2694e0c5\r\n\
a=ssrc:2245113309 msid:Zo9ShgFMRP1qHcHauC5vG53apc6wJyEdMaNE 226ef829-4aa4-4e28-96db-ad374db49a83\r\n\
a=ssrc:2245113309 mslabel:Zo9ShgFMRP1qHcHauC5vG53apc6wJyEdMaNE\r\n\
a=ssrc:2245113309 label:226ef829-4aa4-4e28-96db-ad374db49a83\r\n\
a=rtcp-fb:97 nack\r\n\
a=rtcp-fb:97 nack pli\r\n\
a=rtcp-fb:97 goog-remb\r\n\
a=rtcp-fb:97 ccm fir\r\n\
a=ice-ufrag:55G8\r\n\
a=ice-pwd:NQSO/WCpPhX7MNsY0FTbJ9\r\n\
a=fingerprint:sha-256 72:48:E7:59:69:47:15:F5:85:A9:58:9E:CD:65:91:AE:59:F1:8C:57:8A:43:9E:08:99:22:7F:08:2D:68:A5:BB"

  var interop = new Interop();

  var unifiedPlanDifferentPtOffer = new RTCSessionDescription({
    type: 'offer',
    sdp: unifiedPlanDifferentPt
  });

  var exceptionRaised = false;
  try {
    var planBOffer = interop.toPlanB(unifiedPlanDifferentPtOffer);
  } catch (ex) {
    assert.ok (true);
  }
});

QUnit.test('RaiseExceptionWhenPayloadTypesAreDifferent', function (assert) {
  /*jshint multistr: true */
  var unifiedPlanDifferentPt = "v=0\r\n\
o=- 3676259274 3676259276 IN IP4 0.0.0.0\r\n\
s=Kurento Media Server\r\n\
c=IN IP4 0.0.0.0\r\n\
t=0 0\r\n\
a=group:BUNDLE audio-100010 video-100020 audio0 video0\r\n\
a=msid-semantic:WMS *\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 111 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=sendrecv\r\n\
a=ssrc:3473898950 cname:user1930265166@host-2694e0c5\r\n\
a=ssrc:3473898950 msid:default 3d066e9d-7049-42f0-88a0-deca96228e20\r\n\
a=ssrc:3473898950 mslabel:default\r\n\
a=ssrc:3473898950 label:3d066e9d-7049-42f0-88a0-deca96228e20\r\n\
a=mid:audio-100010\r\n\
a=ice-ufrag:55G8\r\n\
a=ice-pwd:NQSO/WCpPhX7MNsY0FTbJ9\r\n\
a=fingerprint:sha-256 72:48:E7:59:69:47:15:F5:85:A9:58:9E:CD:65:91:AE:59:F1:8C:57:8A:43:9E:08:99:22:7F:08:2D:68:A5:BB\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 100\r\n\
b=AS:2000\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:100 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=sendrecv\r\n\
a=ssrc:2206541536 cname:user1930265166@host-2694e0c5\r\n\
a=ssrc:2206541536 msid:default ad836b97-b117-45a3-8faa-bf2de2801b2d\r\n\
a=ssrc:2206541536 mslabel:default\r\n\
a=ssrc:2206541536 label:ad836b97-b117-45a3-8faa-bf2de2801b2d\r\n\
a=mid:video-100020\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=ice-ufrag:55G8\r\n\
a=ice-pwd:NQSO/WCpPhX7MNsY0FTbJ9\r\n\
a=fingerprint:sha-256 72:48:E7:59:69:47:15:F5:85:A9:58:9E:CD:65:91:AE:59:F1:8C:57:8A:43:9E:08:99:22:7F:08:2D:68:A5:BB\r\n\
m=audio 1 UDP/TLS/RTP/SAVPF 96 0\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:96 opus/48000/2\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=mid:audio0\r\n\
a=sendrecv\r\n\
a=ssrc:3553187867 cname:user1930265166@host-2694e0c5\r\n\
a=ssrc:3553187867 msid:Zo9ShgFMRP1qHcHauC5vG53apc6wJyEdMaNE fc6b975c-ae86-41ae-9c7a-0ab64e8dc2f5\r\n\
a=ssrc:3553187867 mslabel:Zo9ShgFMRP1qHcHauC5vG53apc6wJyEdMaNE\r\n\
a=ssrc:3553187867 label:fc6b975c-ae86-41ae-9c7a-0ab64e8dc2f5\r\n\
a=ice-ufrag:55G8\r\n\
a=ice-pwd:NQSO/WCpPhX7MNsY0FTbJ9\r\n\
a=fingerprint:sha-256 72:48:E7:59:69:47:15:F5:85:A9:58:9E:CD:65:91:AE:59:F1:8C:57:8A:43:9E:08:99:22:7F:08:2D:68:A5:BB\r\n\
m=video 1 UDP/TLS/RTP/SAVPF 97\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=rtpmap:97 VP8/90000\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=rtcp-mux\r\n\
a=mid:video0\r\n\
a=sendrecv\r\n\
a=ssrc:2245113309 cname:user1930265166@host-2694e0c5\r\n\
a=ssrc:2245113309 msid:Zo9ShgFMRP1qHcHauC5vG53apc6wJyEdMaNE 226ef829-4aa4-4e28-96db-ad374db49a83\r\n\
a=ssrc:2245113309 mslabel:Zo9ShgFMRP1qHcHauC5vG53apc6wJyEdMaNE\r\n\
a=ssrc:2245113309 label:226ef829-4aa4-4e28-96db-ad374db49a83\r\n\
a=rtcp-fb:97 nack\r\n\
a=rtcp-fb:97 nack pli\r\n\
a=rtcp-fb:97 goog-remb\r\n\
a=rtcp-fb:97 ccm fir\r\n\
a=ice-ufrag:55G8\r\n\
a=ice-pwd:NQSO/WCpPhX7MNsY0FTbJ9\r\n\
a=fingerprint:sha-256 72:48:E7:59:69:47:15:F5:85:A9:58:9E:CD:65:91:AE:59:F1:8C:57:8A:43:9E:08:99:22:7F:08:2D:68:A5:BB"

  var interop = new Interop();

  var unifiedPlanDifferentPtOffer = new RTCSessionDescription({
    type: 'offer',
    sdp: unifiedPlanDifferentPt
  });

  var exceptionRaised = false;
  try {
    var planBOffer = interop.toPlanB(unifiedPlanDifferentPtOffer);
  } catch (ex) {
    assert.ok (true);
  }
});
