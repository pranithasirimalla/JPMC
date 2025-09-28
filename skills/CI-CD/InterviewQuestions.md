# CI/CD Interview Questions

## Jenkins

### 1. What is Jenkins?
**Answer:**
Jenkins is an open-source automation server used to automate building, testing, and deploying software.

### 2. How do you configure a Jenkins pipeline?
**Example:**
```groovy
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Building...'
      }
    }
  }
}
```

## GitHub Actions

### 1. What are GitHub Actions?
**Answer:**
GitHub Actions is a CI/CD platform that allows you to automate workflows directly in your GitHub repository.

**Example:**
```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run a one-line script
        run: echo Hello, world!
```
