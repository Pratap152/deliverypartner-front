pipeline {

    options {
        buildDiscarder(logRotator(
            numToKeepStr: '5',
            artifactNumToKeepStr: '2'
        ))
        skipDefaultCheckout(true)
    }

    agent {
        docker {
            image 'pratap1371/rider-build-env:latest'
            args '-u root:root -v /var/lib/jenkins/.gradle:/root/.gradle'
        }
    }

    environment {
        AWS_BUCKET = "deliverypartner"
        APK_NAME = "rider-app-${BUILD_NUMBER}.apk"
        GRADLE_USER_HOME = "/root/.gradle"
        GRADLE_OPTS = "-Dorg.gradle.daemon=true -Dorg.gradle.parallel=true -Dorg.gradle.caching=true"
    }

    tools {
        nodejs "node20"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'merge-final-dev',
                url: 'https://github.com/Pratap152/rider-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                npm ci --prefer-offline --no-audit
                '''
            }
        }

        stage('Prepare React Native') {
            steps {
                sh '''
                chmod +x android/gradlew
                
                cd android
                ./gradlew generateCodegenArtifactsFromSchema
                cd ..
                '''
            }
        }

        stage('Build APK') {
            steps {
                dir('android') {
                    sh '''
                    ./gradlew assembleRelease \
                    --parallel \
                    --build-cache \
                    --daemon \
                    --configure-on-demand \
                    --max-workers=2 \
                    -x lint \
                    -x test
                    '''
                }
            }
        }

        stage('Rename APK') {
            steps {
                sh '''
                APK_FILE=$(find android -name "*.apk" | head -n 1)
                cp "$APK_FILE" ${APK_NAME}
                ls -lh *.apk
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                    aws s3 cp ${APK_NAME} s3://${AWS_BUCKET}/${APK_NAME}
                    '''
                }
            }
        }

        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: '*.apk', fingerprint: true
            }
        }
    }

    post {
        success {
            echo "✅ Build Successful"
        }

        failure {
            echo "❌ Build Failed"
        }
    }
}
