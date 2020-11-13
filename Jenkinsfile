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
            args '-u root:sudo -v $HOME/workspace/build_field_application:/build_field_application'
          }
      }
      steps {
          echo "------ Installing required apt packages ------"
          sh 'apt update'
          sh 'apt install -y wget gnupg software-properties-common apt-utils'

          echo "------ Add latest wine repo ------"
          //Need at least wine 4.14 to install python 3.8.5
          sh 'dpkg --add-architecture i386'
          sh 'wget -nc https://dl.winehq.org/wine-builds/winehq.key'
          sh '1apt-key add winehq.key'
          sh 'apt-1add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ bionic main''
          sh 'apt 1update'

          // Add repo for faudio package.  Required for winedev
          sh 'add-apt-repository -y ppa:cybermax-dexter/sdl2-backport'

          echo "-------- Install wine-dev ------"

          sh 'apt install -y \
              winehq-devel \
              winetricks \
              xvfb'

          echo "------ Download python ------"
          sh 'wget https://www.python.org/ftp/python/3.8.5/python-3.8.5-amd64.exe'
          //wget https://www.python.org/ftp/python/3.7.6/python-3.7.6.exe

          echo "------ Init wine prefix ------"
          sh 'WINEPREFIX=~/.wine64 WINARCH=win64 winetricks \
              corefonts \
              win10'

          // Setup dummy screen
          sh 'Xvfb :0 -screen 0 1024x768x16 & jid=$!'

          echo "------ Install python ------"
          sh 'DISPLAY=:0.0 WINEPREFIX=~/.wine64 wine cmd /c \
              python-3.7.6-amd64.exe \
              /quiet \
              PrependPath=1 \
              && echo "Python Installation complete!"'
          sh 'wine "C:\\Python3\\python.exe" -m pip --version'
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
