@Library('automation@v3.0.0')

def label = "build_leetbot_${UUID.randomUUID().toString()}"
def imageName = 'telegram-bots/leetbot'
// Each step the pipeline shall execute.
Map<String,Closure> steps = [
    "Setup": {
        sh 'yarn install'
    },
    "Test": {
        sh 'yarn test'
        sh 'yarn test:publish_coverage'
    }
]
def stepsImage = 'node:10-alpine'

dockerAutomation.generic(label, imageName, steps, stepsImage)
