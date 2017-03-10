import { writeFileSync, readFileSync } from 'fs';

let openviduComponent = readFileSync('src/openvidu.component.ts').toString();
writeFileSync('src/openvidu.component.ts.bak', openviduComponent);

const styles = readFileSync('src/css/openvidu.component.css');
openviduComponent = openviduComponent.replace(/styleUrls:\s*\[.*?\]/, `styles: [\`${styles}\`]`);

const html = readFileSync('src/openvidu.component.html');
openviduComponent = openviduComponent.replace(/templateUrl:\s*\'.*?\'/, `template: \`${html}\``);

writeFileSync('src/openvidu.component.ts', openviduComponent);
