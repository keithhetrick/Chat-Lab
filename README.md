# Chat Lab

This is a chat room for developers who are interested in artificial intelligence. It is a place to discuss the latest developments in the field, share ideas, and ask questions. There's also a fully integrated OpenAI GPT-3 bot that you can talk code with.

## Installation

1. Clone the repo

```sh
git clone <repo_url>
```

2. Install NPM packages on both the client and server

```sh
cd client
npm install

cd server
npm install
```

3. Create a .env file in the server directory and add the following:

```sh
PORT=8000 || <your_port_number>
NODE_ENV=<development> || <production>
MONGODB_URL=<your_mongoDB_uri> => can be created via MongoDB Atlas
ACCESS_TOKEN_SECRET=<your_access_token_secret> => can be generated inside Node shell via the following command: require('crypto').randomBytes(64).toString('hex')
REFRESH_TOKEN_SECRET=<your_refresh_token_secret> => use the same command as above, and paste the new result into the .env file
```

4. Run the app on both the client and server

```sh
npm run start => client
nodemon server => server
```

## Usage

1. Create an account
2. Login
3. Start chatting!
4. Go to the AI tab to talk code with ChatGPT-3
