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
        echo 'Testing.. 1'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploying....'
        discordSend 
          description: "Jenkins Pipeline Build for Flower Power", 
          footer: "(Build number " + env.BUILD_NUMBER +")", 
          link: env.BUILD_URL, result: currentBuild.currentResult, 
          title: JOB_NAME + " - " + env.BUILD_NUMBER , 
          webhookURL: env.WEBHOOK_URL
        echo 'Discord?'
      }
    }

  }
}