@Library('automation@v3.0.1')

def label = "build_leetbot_${UUID.randomUUID().toString()}"
def imageName = 'telegram-bots/leetbot'
// Each step the pipeline shall execute.
Map<String,Closure> steps = [
    "Setup": {
        sh 'yarn install'
    },
    "Test": {
        sh 'yarn test'
        publishHTML(target: [
            allowMissing: false,
            alwaysLinkToLastBuild: false,
            keepAll: false,
            reportDir: 'coverage',
            reportFiles: 'index.html',
            reportName: 'Jest Report'
        ])
    }
]
def stepsImage = 'node:10-alpine'

dockerAutomation.generic(label, imageName, steps, stepsImage)
