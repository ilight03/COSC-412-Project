# 1. Start with a Java environment
FROM eclipse-temurin:17-jdk-jammy

# 2. Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# 3. Set the working directory
WORKDIR /app

# 4. Copy your code into the container
COPY . .

# 5. Run your build
RUN cd backend && ./mvnw clean install

# 6. Find the generated jar, copy it to a standard name, and run it
RUN cp backend/target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
