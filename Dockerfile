# Base image
FROM node:18

# Install required dependencies
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    curl

# Set Java environment
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Set Android SDK paths
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install Android SDK
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    cd $ANDROID_HOME/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-*.zip && \
    mv cmdline-tools latest

# Accept licenses
RUN yes | sdkmanager --licenses || true

# Install required Android packages
RUN sdkmanager "platform-tools" \
               "platforms;android-33" \
               "build-tools;33.0.0"

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install npm dependencies
RUN npm install

# Build APK
RUN cd android && chmod +x gradlew && ./gradlew assembleRelease

# Default command
CMD ["echo", "Build completed"]
