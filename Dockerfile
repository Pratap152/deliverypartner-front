FROM node:20

# Install dependencies
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    curl \
    python3 \
    python3-pip \
    build-essential \
    libc6 \
    libstdc++6 \
    cmake \
    ninja-build \
    awscli \
    && rm -rf /var/lib/apt/lists/*

# Java setup
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install Android SDK
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    cd $ANDROID_HOME/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-9477386_latest.zip && \
    mkdir latest && \
    mv cmdline-tools/* latest/ && \
    rm -rf cmdline-tools commandlinetools-linux-9477386_latest.zip

# Accept licenses
RUN yes | sdkmanager --licenses

# Install SDK packages
RUN sdkmanager \
    "platform-tools" \
    "platforms;android-33" \
    "build-tools;33.0.0" \
    "ndk;27.1.12297006" \
    "cmake;3.22.1" \
    "extras;android;m2repository" \
    "extras;google;m2repository"

# Gradle config
ENV GRADLE_USER_HOME=/gradle

# Working directory
WORKDIR /app

CMD ["bash"]
