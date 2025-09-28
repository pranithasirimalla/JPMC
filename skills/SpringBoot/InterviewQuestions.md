# Spring Boot Interview Questions

## Projects

### 1. What is Spring Boot and why is it used?
**Answer:**
Spring Boot is a framework for building stand-alone, production-grade Spring applications with minimal configuration.

### 2. How do you create a REST API using Spring Boot?
**Example:**
```java
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }
}
```

## Concepts

### 1. What is dependency injection in Spring?
**Answer:**
Dependency Injection is a design pattern where the dependencies are injected by the framework rather than being created by the class itself.

### 2. What is the difference between @Component, @Service, and @Repository?
**Answer:**
All are stereotypes for Spring beans, but they are used for different layers: @Component (generic), @Service (service layer), @Repository (data access layer).
