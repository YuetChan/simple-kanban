pipeline{
  agent any
      tools {
        jdk 'openjdk-11'
        maven 'mvn-3.6.3'
    }

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: env.GIT_BRANCH]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/YuetChan/simple-kanban.git']]])
      }
    }

    stage('Compile') {
      steps {
        sh 'mvn compile'
      }
    }

    stage('Unit test') {
      steps {
        sh 'mvn test'
      }
    }
  }
}
