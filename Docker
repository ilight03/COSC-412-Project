# 1. Start with a Java environment
FROM eclipse-temurin:17-jdk-jammy

# 2. Install Node.js (since Render detected you need it)
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# 3. Set the working directory
WORKDIR /app

# 4. Copy your code into the container
COPY . .

# 5. Run your build
RUN cd backend && ./mvnw clean install

# 6. Define how to start your app (update the path to your actual JAR)
CMD ["java", "-jar", "backend/target/your-app-name.jar"]
