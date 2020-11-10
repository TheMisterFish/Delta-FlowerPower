pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Building..'
      }
    }

    stage('Test') {
      steps { 
        echo 'Testing..'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploying....'
        // sh '/usr/local/bin/docker-compose up --build'
        discordSend description: "Jenkins Pipeline Build", footer: "Footer Text", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/775650807730405418/MnDWwznYRlHqAfFze7SgeVZbj5uYIkM95psfi4anzJmPruwwBDoeVOp9Uy9abk12Ii0-"
      }
    }

  }
}