# Chat Lab

This is a chat room for developers who are interested in artificial intelligence. It is a place to discuss the latest developments in the field, share ideas, and ask questions. There's also a fully integrated OpenAI GPT-3 bot that you can talk code with.

## Chat Lab Built with:

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- [Express Async Handler](https://www.npmjs.com/package/express-async-handler)
- [Web Socket](https://socket.io/)
- [OpenAI ChatGPT-3](https://openai.com/blog/openai-api/)
- [Tailwind](https://tailwindcss.com/)
- [UUID](https://www.npmjs.com/package/uuid)
- [Axios](https://www.npmjs.com/package/axios)
- [JSON Web Tokens](https://jwt.io/)
- [Cookie Parser](https://www.npmjs.com/package/cookie-parser)
- [Body Parser](https://www.npmjs.com/package/body-parser)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Cors](https://www.npmjs.com/package/cors)
- [Helmet](https://www.npmjs.com/package/helmet)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Date FNS](https://www.npmjs.com/package/date-fns)
- [Graceful Shutdown](https://www.npmjs.com/package/graceful-shutdown)
- [AutoPrefixer](https://www.npmjs.com/package/autoprefixer)
- [PostCSS](https://www.npmjs.com/package/postcss)
- [Lodash](https://www.npmjs.com/package/lodash)

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
