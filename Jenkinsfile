@Library('automation@v3.3.5')

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
def stepsImage = 'node:12-alpine'

dockerAutomation.github(label, imageName, steps, stepsImage)
