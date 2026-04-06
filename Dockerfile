# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-jammy AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Convert Windows line endings (CRLF) to Unix line endings (LF) on the Maven wrapper 
# This prevents permission and execution errors when building the image on a Linux host (like Render)
RUN sed -i 's/\r$//' mvnw

# Download dependencies (this caches them as a separate Docker layer to speed up builds)
RUN ./mvnw dependency:go-offline

# Copy the actual source code
COPY src ./src

# Build the Spring Boot application, skipping tests to speed up deployment
RUN ./mvnw clean package -DskipTests

# Stage 2: Create a lightweight runtime image
FROM eclipse-temurin:17-jre-jammy

# Set working directory for the runtime environment
WORKDIR /app

# Copy the built JAR file from the "build" stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 to the outside world
EXPOSE 8080

# Execute the application. 
# Using ${PORT:8080} ensures compatibility with Render since Render dynamically injects a PORT env variable.
ENTRYPOINT ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]
