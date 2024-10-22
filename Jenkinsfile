pipeline {
  agent any

  tools { nodejs "Jenkins_NodeJS" }
  environment {
      DIS_DESC = "Jenkins Pipeline Build for Flower Power"
      DIS_FOOT = "(Build number ${env.BUILD_NUMBER})"
      DIS_TITL = "${JOB_NAME} - ${env.BUILD_NUMBER}"

      MONGO_USERNAME = "admin"
      MONGO_PASSWORD = "admin"
      INITIAL_PASSWORD  = "admin"

      NESTJS_PORT=7080
      NESTJS_DEBUG_MODE=false
      NESTJS_NODE_ENV='production'
      NESTJS_MONGO_CONNECTION_STRING_DEBUG="mongodb://localhost:27017/flowerpower"
      NESTJS_MONGO_CONNECTION_STRING_PROD="mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@fp_mongodb:27018/flowerpower"

      BROADCAST = false
  }
  
  stages {
    // Generate empty .env file so we can use our own
    stage("Touch .env file") {
      steps {
        writeFile file: '.env', text: ''
      }
    }
    // Run NestJS jest test
    stage('NestJS API Test') {
      steps { 
        echo 'Testing NestJS API using Jest'
        sh 'node -v'
        dir("nestjs") {
          // sh 'npm prune'
          // sh 'npm install'
          // sh 'npm test'
        }
      }
    }
    // Run Research Platform tests
    /*
    stage('Research Platform tests') {
      steps { 
        echo 'Testing Research Platform using ...'
        // code
      }
    }
    */
    // Run field application tests
    /*
    stage('Field Application tests') {
      steps { 
        echo 'Testing Field Application using ...'
        // code
      }
    }
    */
    // Build & Deploy using docker compose
    
      stage('Build test') {
        steps {
          script {
            echo "Current branch: " env.BRANCH_NAME
            if (env.BRANCH_NAME=='master'){
              echo 'Deploying....'
              sh "docker-compose down"
              sh "docker-compose up --build --force-recreate -d"
              sh "docker ps -a"
              env.BROADCAST = true
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
          echo env.BROADCAST
          if(env.BROADCAST == true){
            sh "docker logs fp_nginx"
            sh "docker logs fp_mongodb"
            sh "docker logs fp_nestjs"

            echo currentBuild.currentResult
          }
        }
      }
      success {
        script {
          echo env.BROADCAST
          if(env.BROADCAST == true){
            discordSend description: env.DIS_DESC, footer: env.DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: env.DIS_TITL, webhookURL: env.WEBHOOK_URL
          }
        }
      }
      unsuccessful { 
        script {
          if(env.BROADCAST == true){
            discordSend description: env.DIS_DESC + "- FAILED", footer: env.DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: env.DIS_TITL, webhookURL: env.WEBHOOK_URL
          }
        }
      }
  }
}
