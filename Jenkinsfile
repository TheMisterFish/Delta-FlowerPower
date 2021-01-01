pipeline {
    agent any

    tools { nodejs "Jenkins_NodeJS" }
    environment {
        DIS_DESC = "Jenkins Pipeline Build for Flower Power"
        DIS_FOOT = "(Build number ${env.BUILD_NUMBER})"
        DIS_TITL = "${JOB_NAME} - ${env.BUILD_NUMBER}"

        MONGO_USERNAME = "${env.FLOWERPOWER_MONGO_USERNAME}"
        MONGO_PASSWORD = "${env.FLOWERPOWER_MONGO_PASSWORD}"
        INITIAL_PASSWORD  = "${env.FLOWERPOWER_INITIAL_PASSWORD}"

        NESTJS_PORT=7080
        NESTJS_DEBUG_MODE=false
        NESTJS_NODE_ENV='production'
        NESTJS_MONGO_CONNECTION_STRING_DEBUG="mongodb://localhost:27017/flowerpower"
        NESTJS_MONGO_CONNECTION_STRING_PROD="mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@fp_mongodb:27018/flowerpower"
    }
    
    stages {
        // Generate empty .env file so we can use our own
        stage("Touch .env file") {
            steps {
                writeFile file: '.env', text: ''
            }
        }
        // Run field application python build
        stage('Buid Field Application - Python') {
            steps {
                sh 'docker create --name field-app-buld-tmp cdrx/pyinstaller-windows'
                sh 'ls'
                sh 'chmod +x ./field_application/fieldapp_entrypoint.sh'
                sh 'docker cp ./field_application field-app-buld-tmp:/app/'
                sh 'docker commit field-app-buld-tmp foo'
                sh 'docker run --name field_app_build --entrypoint "/app/fieldapp_entrypoint.sh" foo'
                sh "docker cp field_app_build:/tmp/backend_dist ./field_application/public"
            }
        }
        // Run field application electron build
        stage('Buid Field Application - Electron') {
            steps { 
                dir("field_application") {
                    writeFile file: '.env', text: 'VUE_APP_MODE=PRODUCTION'
                    sh 'npm prune'
                    sh 'npm install'
                    sh 'npm run electron:winbuild'
                    sh "ls -a"
                    sh "ls ./field_app_build -a"
                }
            }      
        }

        //Zip the field_app_build
    
        // Run NestJS jest test
        stage('NestJS API Test') {
            steps { 
                echo 'Testing NestJS API using Jest'
                sh 'node -v'
                dir("nestjs") {
                sh 'npm prune'
                sh 'npm install'
                sh 'npm test'
                }
            }
        }

        // Build & Deploy using docker compose
        stage('Build test') {
            steps {
                script {
                    echo "Current branch: " + env.BRANCH_NAME
                    if (env.BRANCH_NAME == "master"){
                        echo 'Deploying....'
                        sh "docker-compose down"
                        sh "docker-compose up --build --force-recreate -d"
                        sh "docker ps -a"
                    } else {
                        echo "Not deploying since it's not 'master' branch"
                    }
                }
            }
        }
    }
    post { 
        always {
            script {
                try {
                    sh 'docker container stop field_app_build'
                    sh 'docker container rm field_app_build'
                } catch (Exception e) {
                    sh 'echo "Could not stop/remove field_app_build"'

                }
                try {
                    sh 'docker container stop field-app-buld-tmp'
                    sh 'docker container rm field-app-buld-tmp'
                } catch (Exception e) {
                    sh 'echo "Could not stop/remove field-app-buld-tmp"'
                }
                echo env.BRANCH_NAME
                if(env.BRANCH_NAME == "master"){
                    sh "docker logs fp_nginx"
                    sh "docker logs fp_mongodb"
                    sh "docker logs fp_nestjs"

                    echo currentBuild.currentResult
                }
            }
        }
        success {
            script {
                echo "Succesfully build"
                if(env.BRANCH_NAME == "master"){
                    echo "Sending success message to discord server"
                    discordSend description: env.DIS_DESC, footer: env.DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: env.DIS_TITL, webhookURL: env.WEBHOOK_URL
                }
            }
        }
        unsuccessful { 
            script {
                echo "Unsuccesfully build"
                if(env.BRANCH_NAME == "master"){
                    echo "Sending unsuccess message to discord server"
                    discordSend description: env.DIS_DESC + "- FAILED", footer: env.DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: env.DIS_TITL, webhookURL: env.WEBHOOK_URL
                }
            }
        }
    }
}
