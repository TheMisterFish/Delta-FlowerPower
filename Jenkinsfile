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
    // Run field application tests
    stage('Buid Field Application - Python') {
      agent {
          docker { 
            image 'python:3'
            args '-u root:sudo -v $HOME/workspace/myproject:/myproject'
          }
      }
      steps {
          sh 'apt-get update && pip3 install --upgrade pip'
          sh 'apt-get install -y wine'
          sh 'wget https://www.python.org/ftp/python/2.7.9/python-2.7.9.amd64.msi'
          sh 'dpkg --add-architecture i386 && apt-get update && apt-get install -y wine32'
          sh 'wine msiexec /i python-2.7.9.amd64.msi /qb'
          sh 'wine "C:\\Python27\\python.exe" -m pip --version'
      }
      // steps { 
      //   script {
      //     withPythonEnv('System-CPython-3'){
      //       echo 'Installing python requirements'
      //       // wine  "--version"
      //       sh "ls"
      //       sh "ls .."
      //       sh "ls ../.."
      //       sh "ls ../../.."
      //       dir("field_application/pycalc") {
      //         // sh "python -V"
      //         // sh "python3 -V"
      //         // sh "pip3 install -r requirements.txst"
      //       }
      //       echo 'Building field application'
      //       dir("field_application") {
      //         // sh 'pyinstaller pycalc/api.py --noconfirm --distpath pycalcdist'
      //       }
      //     }   
      //   }
      // }   
    }
    // stage('Buid Field Application - Electron') {
    //   steps { 
    //     dir("field_application") {
    //       // sh 'npm prune'
    //       // sh 'npm install'
    //       // sh 'npm run rebuild_electron'
    //       // sh "npm run electron_build"
    //       // sh "ls"
    //       // sh "ls ./release-builds"
    //     }
    //   }      
    // }
    
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
    // Build & Deploy using docker compose
    
      stage('Build test') {
        steps {
          script {
            echo "Current branch: " + env.BRANCH_NAME
            if (env.BRANCH_NAME=='master'){
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
          echo env.BROADCAST
          if(env.BRANCH_NAME=='master'){
            sh "docker logs fp_nginx"
            sh "docker logs fp_mongodb"
            sh "docker logs fp_nestjs"

            echo currentBuild.currentResult
          }
        }
      }
      success {
        script {
          if(env.BRANCH_NAME=='master'){
            discordSend description: env.DIS_DESC, footer: env.DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: env.DIS_TITL, webhookURL: env.WEBHOOK_URL
          }
        }
      }
      unsuccessful { 
        script {
          if(env.BRANCH_NAME=='master'){
            discordSend description: env.DIS_DESC + "- FAILED", footer: env.DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: env.DIS_TITL, webhookURL: env.WEBHOOK_URL
          }
        }
      }
  }
}
