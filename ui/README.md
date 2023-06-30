## Running the UI app Locally

To run the ui app locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`

2. Navigate to the project directory: `cd /path/to/repository/ui`

3. Install the dependencies: `npm install`

4. Update the environment variables in the `.env` file located in the `ui` directory
    ```
    NODE_ENV=local
    REACT_APP_BACKEND_URL=<your-backend-url>
    REACT_APP_OAUTH_URL=<your-oauth-url>
    ```
5. Start the development server: `npm run start:local`

6. Open your browser and navigate to `http://localhost:3000`

### Deploying the UI App
To deploy the Ui app, follow these steps:

1. Clone the repository: `git clone <repository-url>`

2. Navigate to the project directory: `cd /path/to/repository/ui`

3. Update the environment variables in the `.env.deploy` file located in the `/ui` directory to match your deployment environment.    

4. Build the project:
    ```
    npm run build:deploy
    ```
5. For AWS user, upload the `/build` folder to a S3 bucket and setup the web endpoint