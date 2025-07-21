# Song-Management
A simple REST API for managing songs built with Node.js and Express, designed to work with the React frontend using webpack.
## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ File-based JSON storage
- ✅ Pagination support
- ✅ Input validation
- ✅ Error handling
- ✅ Statistics endpoint

## Installation
### Backend Setup

1. Create a new directory for the backend:
\`\`\`bash
mkdir SongManagement
cd SongManagement
\`\`\`

2. Initialize npm and install dependencies:
\`\`\`bash
npm init -y
npm install express cors multer uuid
npm install --save-dev nodemon
\`\`\`

3. Copy the server files (server.js, routes/songs.js) to your project directory

4. Start the backend server:
\`\`\`bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
\`\`\`

The backend server will start on `http://localhost:5000`

### Frontend Setup (Webpack)

1. In your React frontend directory, install the required dependencies:
\`\`\`bash
npm install react react-dom
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader html-webpack-plugin sass sass-loader style-loader webpack webpack-cli webpack-dev-server
\`\`\`

2. Create the webpack configuration files:
   - `webpack.config.js`
   - `.babelrc`
   - `package.json` with proper scripts
3. Start the frontend development server:
\`\`\`bash
npm run serve
The frontend will run on `http://localhost:3002`

### Songs
- `GET /api/songs` - Get all songs (with pagination and search)
- `GET /api/songs/:id` - Get a specific song
- `POST /api/songs` - Create a new song
- `PUT /api/songs/:id` - Update a song
- `DELETE /api/songs/:id` - Delete a song
