import { writeFileSync, readFileSync } from 'fs';

// OpenViduComponent
let openviduComponent = readFileSync('src/openvidu.component.ts').toString();
writeFileSync('src/openvidu.component.ts.bak', openviduComponent);

const openviduComponentStyles = readFileSync('src/css/openvidu.component.css');
openviduComponent = openviduComponent.replace(/styleUrls:\s*\[.*?\]/, `styles: [\`${openviduComponentStyles}\`]`);

const openviduComponentHtml = readFileSync('src/openvidu.component.html');
openviduComponent = openviduComponent.replace(/templateUrl:\s*\'.*?\'/, `template: \`${openviduComponentHtml}\``);

writeFileSync('src/openvidu.component.ts', openviduComponent);

// StreamComponent
let streamComponent = readFileSync('src/stream.component.ts').toString();
writeFileSync('src/stream.component.ts.bak', streamComponent);

const streamComponentStyles = readFileSync('src/css/stream.component.css');
streamComponent = streamComponent.replace(/styleUrls:\s*\[.*?\]/, `styles: [\`${streamComponentStyles}\`]`);

writeFileSync('src/stream.component.ts', streamComponent);
