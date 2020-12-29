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
    //   agent {
    //       docker { 
    //         image 'cdrx/pyinstaller-windows:python3-32bit'
    //         args '-u root:sudo -v $HOME/workspace/build_field_application:/build_field_application'
    //       }
    //   }
      steps {
        script {
            try {
                sh 'docker container stop flowerpower_jenkins_fieldapp'
                sh 'docker container rm flowerpower_jenkins_fieldapp'
            } catch (Exception e) {
                echo 'Exception occurred: ' + e.toString()
                sh 'Handle the exception!'
            }
        }
        sh 'docker run --name flowerpower_jenkins_fieldapp -v "$(pwd):/src/" cdrx/pyinstaller-windows -c "apt-get update -y && apt-get install -y wget && whoami && wine python --version && wine python -m pip --version"'
        sh 'docker container ls'
        // sh 'ls ~/.'
        // sh 'ls ./'
        // sh 'ls ./winetricks'
        // sh 'whoami'
        // sh 'wine --version'
        // sh 'wine python --version'
        // sh 'winetricks --version'
        // sh 'winetricks python --version'
        // sh 'wine pip help'
        // sh 'wine py -m pip --version'
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
