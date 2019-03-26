# Angular Openvidu Demo

This is a demo app that implements **angular-openvidu**, using ALL the features included in the component.

<p align="center"><img src="https://github.com/alxhotel/angular-openvidu/blob/master/docs/screenshots/app.png?raw=true"/></p>

## Installation

1. Install `@angular/cli` through npm:

	```bash
	$ sudo npm install -g @angular/cli
	```

2. Start docker:

	```bash
	$ sudo docker run -p 8443:8443 --rm -e KMS_STUN_IP=193.147.51.12 -e KMS_STUN_PORT=3478 openvidu/openvidu-server-kms
	```

3. Install dependencies:

	```bash
	$ npm install
	```

4. Start the server from the root folder of the app:

	```bash
	$ ng serve
	```

*Note: To run the preceding commands, [Node.js](http://nodejs.org), [npm](https://npmjs.com) and [docker](https://www.docker.com/) must be installed.*

## Usage

Open your browser at: [http://localhost:4200](http://localhost:4200).

The app will automatically reload if you change any of the source files.

## Running unit tests

To execute the unit tests via [Karma](https://karma-runner.github.io), run:

```sh
$ ng test
```

## Running end-to-end tests

To execute the end-to-end tests via [Protractor](http://www.protractortest.org/), run:

```sh
$ ng e2e
```

Before running the tests make sure you are serving the app via `ng serve`.

## Troubleshooting

### Why does it keep saying "Connecting..."?

You may be having some trouble connecting to the OpenVidu Server's websocket.

To make sure you are accepting its certificate go to:

- `[IP]`: Openvidu Server IP
- `[PORT]`: Openvidu Server port

```
https://[IP]:[PORT]/room
```

And make sure to accept its certificate. Then go back to the app and refresh the page.

### Why does it keep saying "Joining room..." or "Loading camera..."?

If you are accessing the app through a host different from `localhost` then you need to enable `HTTPS`.

At least in Google Chrome, this is because: *Any website which has integrated geolocation technology, screen-sharing, WebRTC and more, will now be required
 to be served from a secure (HTTPS) site.*

You could use [ngrok](https://ngrok.com/) to make an SSL tunnel to your computer. Or you could create a self-signed certificate,
but don't use it in production.

Create an SSL key:

- `[SSL_KEY_PATH]`: your SSL key path
- `[SSL_CERT_PATH]`: your SSL cert path

```bash
$ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "[SSL_KEY_PATH]" -out "[SSL_CERT_PATH]"
```

To enable HTTPS just run `angular-cli` with this command:

```bash
$ ng serve --ssl true --ssl-key "[SSL_KEY_PATH]" --ssl-cert "[SSL_CERT_PATH]" --host=0.0.0.0
```

Since you are not using `localhost`, you need `host=0.0.0.0` to listen for all IPs; you can change it to listen only for the IPs needed.

## License

Apache Software License 2.0 ©
