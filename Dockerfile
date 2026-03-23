FROM node:20

# Install Java + Android tools (but don't build APK here)
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set Java
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Android SDK paths
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install Android SDK (minimal)
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    cd $ANDROID_HOME/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-9477386_latest.zip && \
    mkdir latest && \
    mv cmdline-tools/* latest/ && \
    rm -rf cmdline-tools commandlinetools-linux-9477386_latest.zip

# Accept licenses
RUN yes | sdkmanager --licenses

# Install required SDK packages
RUN sdkmanager \
    "platform-tools" \
    "platforms;android-33" \
    "build-tools;33.0.0"

# Working directory
WORKDIR /app

# Default command
CMD ["bash"]
