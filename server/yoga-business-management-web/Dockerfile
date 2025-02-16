# Build stage
FROM maven:3-openjdk-17 AS build
WORKDIR /app

# Copy all the files including the .env file
COPY . .

# Run the Maven build
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the .war file from the build stage
COPY --from=build /app/target/yoga-business-management-web.war yoga-business-management-web.war

# Copy the .env file to the container (optional but useful for debugging)
COPY .env .env

# Expose the port 8080
EXPOSE 8080

# Optionally, set the environment variables (if needed)
# For example, you can set individual variables here as needed
# ENV SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/my_database

# If you have a lot of variables in .env, it's better to use an entrypoint script
ENTRYPOINT ["java", "-jar", "yoga-business-management-web.war"]
