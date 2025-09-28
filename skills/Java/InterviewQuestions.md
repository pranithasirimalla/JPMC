# Java Interview Questions

## Backend

### 1. What is the difference between an abstract class and an interface in Java?
**Answer:**
- Abstract class can have method implementations, fields, and constructors. Interface can only have abstract methods (Java 8+ allows default/static methods).
- A class can extend only one abstract class but can implement multiple interfaces.

**Example:**
```java
abstract class Animal {
    abstract void makeSound();
}
interface Swimmable {
    void swim();
}
```

### 2. Explain the concept of multithreading in Java.
**Answer:**
Multithreading allows concurrent execution of two or more threads for maximum utilization of CPU.

**Example:**
```java
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread running");
    }
}
```

## Advanced

### 1. What is the Java Memory Model?
**Answer:**
The Java Memory Model defines how threads interact through memory and what behaviors are allowed in concurrent execution.

### 2. Explain the use of Streams API in Java 8.
**Answer:**
Streams API is used for processing sequences of elements (collections) in a functional style.

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4);
numbers.stream().filter(n -> n % 2 == 0).forEach(System.out::println);
```
