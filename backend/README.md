## Running the Backend Api Locally

To run the backend api locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`

2. Open up project in `/backend` using Intelij

3. Update the environment variables in `.env` file located in `/backend`. 
    ```
    SPRING_ENV=local;
    DB_URL=`<your-db-url>`
    DB_USERNAME=`<your-db-username>`
    DB_PWD=`<your-db-pwd>`
    CORS_ORIGIN=`<your-ui-url>`
    CORRELATION_ALIAS=correlationId
    ```

4. Build and run the application using Intelij

Access the backend api at `http://localhost:8080`

### Deploying the Backend Api

To deploy the backend API, follow these steps:

1. Build the project using Maven:
    ```
    mvn -DskipTests package
    ```

2. Build the Docker image:
    ```
    docker build -t <image-name> .
    ```
3. Run the Docker container:
    ```
    docker run -d -p 8080:8080 --name <container-name> <image-name> -e SPRING_ENV=<your-env>  -e DB_USERNAME=<your-db-username> -e DB_PWD=<your-db-pwd> -e  DB_URL=<your-db-url> -e CORS_ORIGIN=<your-ui-url> -e CORRELATION_ALIAS="correlation_Id"
    ```
