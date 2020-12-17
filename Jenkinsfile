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
            image 'ubuntu:16.04'
            args '-u root:sudo -v $HOME/workspace/build_field_application:/build_field_application'
          }
      }
      steps {
        //   sh 'apt-get update && pip3 install --upgrade pip'
        //   sh 'apt-get install -y wine xvfb'
          
        //   sh 'dpkg --add-architecture i386 && apt-get update && apt-get install -y wine32'
        //   sh 'wget -N https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks'

        //   // Make dir
        //   sh 'winecfg'
        //   // get python   
        //   sh 'mkdir ~/.wine/drive_c/python'
        //   sh 'wget -O ~/.wine/drive_c/python/python-3.8.5.-amd64.exe https://www.python.org/ftp/python/3.8.5/python-3.8.5-amd64.exe'
    
        //   sh 'chmod +x winetricks'
        //   sh './winetricks -q win10'


        // //   sh 'DISPLAY=:0.0 wine cmd ~/.wine/drive_c/python/python-3.8.5.-amd64.exe \
        // //       PrependPath=1 \
        // //       && echo "Python Installation complete!"'
        //   sh 'DISPLAY=:0.0 wine cmd ~/.wine/drive_c/python/python-3.8.5.-amd64.exe /quiet'
        //   sh "ls ~/.wine/drive_c/"
        //   sh "ls ~/.wine/drive_c/windows"
        //   sh "ls ~/.wine/drive_c/windows/system32"
        //   sh "ls ~/.wine/drive_c/windows/syswow64"
         
        //   sh 'wine python3 -m pip --version'
        //   sh 'wine python36 -m pip --version'
        sh 'apt-get update && pip3 install --upgrade pip'
        sh 'apt-get install -y wine'
        
        sh 'dpkg --add-architecture i386 && apt-get update && apt-get install -y wine32 xvfb'
        sh 'wget -N https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks'

        // Make dir
        sh 'winecfg'
        sh 'mkdir ~/.wine/drive_c/python'
        sh 'wget -O ~/.wine/drive_c/python/python-3.8.5.exe https://www.python.org/ftp/python/3.8.5/python-3.8.5.exe'
        //   sh 'apt-get install -y wine xvfb'

        sh 'chmod +x winetricks'
        sh './winetricks -q win10'

        sh 'Xvfb :0 -screen 0 1024x768x16 & jid=$!'
        sh 'DISPLAY=:0.0 wine ~/.wine/drive_c/python/python-3.8.5.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0 TargetDir="C:/Python3"'

        sh 'ls ~/.wine/drive_c/'
        sh 'ls ~/.wine/drive_c/Python3'
        sh 'ls ~/.wine/drive_c/Python3/Scripts'
        sh 'ls ~/.wine/drive_c/Python3 -l'

        sh 'wine "C:\\Python3\\python.exe" -V'
        sh 'wine "C:\\Python3\\python.exe" -m pip --version'

        //   sh 'wine ~/.wine/drive_c/python/python-3.8.5.-amd64.exe /nogui'
        //   sh 'wine "C:\\Python3\\python.exe" -m pip --version /nogui'
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
