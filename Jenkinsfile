pipeline {
  agent any

  tools {nodejs "Jenkins_NodeJS"}
  
  environment {
      DIS_DESC = "Jenkins Pipeline Build for Flower Power"
      DIS_FOOT = "(Build number ${env.BUILD_NUMBER})"
      DIS_TITL = "${JOB_NAME} - ${env.BUILD_NUMBER}"
    }

  stages {
    stage('Test node') {
      steps { 
        echo 'Testing.. 1'
        sh 'node -v'
      }
    }

    stage('Deploy') {
      
      steps {
        echo 'Deploying....'
        discordSend description: env.DIS_DESC, footer: env.DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: env.DIS_TITL, webhookURL: env.WEBHOOK_URL
        echo 'Discord?'
      }
    }

  }
}