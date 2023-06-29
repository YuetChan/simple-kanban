## Running the OAuth API Locally

To run the oauth api locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`

2. Navigate to the project directory: `cd /path/to/repository/oauth`

3. Install the dependencies: `npm install`

4. Update the environment variables in the `.env` file located in the `/oauth` directory
    ```
    NODE_ENV=local

    BACKEND_URL=<your-backend-url>
    UI_URL=<your-ui-url>

    GOOGLE_CLIENT_SECRET=<your-client-secret>
    GOOGLE_CLIENT_ID=<your-client-id>

    GOOGLE_REDIRECT=<your-google-redirect>

    JWT_SECRET=<your-jwt-secret>
    ```

5. Start the development server: `npm run start:local`

6. Access the oauth api at`http://localhost:3200`

### Deploying the OAuth API
To deploy the oauth API, follow these steps:

1. Build the project:
    ```
    npm run build:deploy
    ```

2. Build the Docker image:
    ```
    docker build -t <image-name> .
    ```

3. Run the Docker container:
    ```
    docker run -d -p 3200:3200 --name <container-name> <image-name> -e NODE_ENV=<your-env>  -e BACKEND_URL=<your-backend-url> -e GOOGLE_CLIENT_SECRET=<your-google-client-secret> -e  GOOGLE_CLIENT_ID=<your-google-client-id> -e GOOGLE_REDIRECT=<your-google-redirect-url> -e JWT_SECRET=<your-jwt-secret>
    ```