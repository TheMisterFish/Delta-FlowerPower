pipeline {
  agent any

  tools {nodejs "Jenkins_NodeJS"}
  
  DIS_DESC = "Jenkins Pipeline Build for Flower Power"
  DIS_FOOT = "(Build number ${env.BUILD_NUMBER})"
  DIS_TITL = "${JOB_NAME} - ${env.BUILD_NUMBER}"
  try {
    stages {
      stage('Test node') {
        steps { 
          echo 'Testing.. 1'
          sh 'node -v'
          dir("folder") {
            sh 'npm prune'
            sh 'npm install'
            sh 'npm test'
          }
        }
      }

      stage('Deploy') {
        
        steps {
          echo 'Deploying....'
          discordSend description: DIS_DESC, footer: DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: DIS_TITL, webhookURL: env.WEBHOOK_URL
          echo 'Discord?'
        }
      }
    }
  }  catch (err) {
    echo 'Deploying....'
    DIS_DESC = "Jenkins Pipeline Build for Flower Power - Failed: " + error
    discordSend description: env.DIS_DESC, footer: env.DIS_FOOT, link: env.BUILD_URL, result: currentBuild.currentResult, title: env.DIS_TITL, webhookURL: env.WEBHOOK_URL
  }
}