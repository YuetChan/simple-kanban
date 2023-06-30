## Running the Backend API Locally

To run the backend api locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`

2. Open up project in `/path/to/repository/backend` using Intelij

3. Update the environment variables in `.env` file located in `/backend`. 
    ```
    SPRING_ENV=local;
    DB_URL=`<your-db-url>`;
    DB_USERNAME=`<your-db-username>`;
    DB_PWD=`<your-db-pwd>`;
    CORS_ORIGIN=`<your-ui-url>`;
    CORRELATION_ALIAS=correlationId;
    ```

4. Build and run the application using Intelij

Access the backend api at `http://localhost:8080`

### Deploying the Backend API

To deploy the backend API, follow these steps:
1. Run the mariadb docker container:
    ```
    docker run -p 3306:3306 -d --name <your-container-name> -e MYSQL_DATABASE=<your-db-name> -e MARIADB_ROOT_PASSWORD=<your-db-pwd> mariadb:<your-db-version>
    ```

2. Clone the repository: `git clone <repository-url>`

3. Navigate to the project directory: `cd /path/to/repository/backend`

4. Build the project using Maven:
    ```
    mvn -DskipTests package
    ```

5. Build the Docker image:
    ```
    docker build -t <image-name> .
    ```
6. Run the Docker container:
    ```
    docker run -d -p 8080:8080 --name <container-name> <image-name> -e SPRING_ENV=<your-env> -e DB_USERNAME=<your-db-username> -e DB_PWD=<your-db-pwd> -e  DB_URL=<your-db-url> -e CORS_ORIGIN=<your-ui-url> -e CORRELATION_ALIAS="correlation_Id"
    ```
