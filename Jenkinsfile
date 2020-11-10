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
      _discord.description = "Jenkins Pipeline Build for Flower Power"
      _discord.footer = "(Build number " + env.BUILD_NUMBER +")"
      _discord.title = JOB_NAME + " - " + env.BUILD_NUMBER
      steps {
        echo 'Deploying....'
        discordSend description: _discord.description, footer: _discord.footer, link: env.BUILD_URL, result: currentBuild.currentResult, title: _discord.title, webhookURL: env.WEBHOOK_URL
        echo 'Discord?'
      }
    }

  }
}