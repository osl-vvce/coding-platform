
# 💻 Coding Platform

Coding Platform is a web-based coding environment designed for coding practice, learning, interviews, and online assessments. It allows users to write and run programs in Python, Java, JavaScript, C, and C++. The platform uses Docker to execute code in isolated environments and provides output, test case results, and error messages. It also includes security features and resource limits to support fair and reliable coding assessments.

## ✨ Features

- Supports multiple programming languages.
- Provides a clean code editor using CodeMirror.
- Runs code using Docker containers.
- Displays output and error messages.
- Supports test cases and function-based submissions.
- Includes assessment security features and resource limits.
- Maintains activity logs for assessments.

## 🛠️ Tech Stack

- **Frontend:** React, CodeMirror
- **Backend:** Node.js, Express.js
- **Code Execution:** Docker
- **Languages:** Python, Java, JavaScript, C, and C++

## 🚀 Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/), [Docker Desktop](https://www.docker.com/products/docker-desktop/), and Git before starting.

### 1. Build Docker Images

Run these commands from the project root:

```bash
docker build -t coding-judge-python judge/images/python
docker build -t coding-judge-java judge/images/java
docker build -t coding-judge-node judge/images/node
docker build -t coding-judge-c judge/images/c
docker build -t coding-judge-cpp judge/images/cpp
```

### 2. Start the Backend

Install dependencies and start the backend from the directory containing its `package.json`:

```bash
npm install
node server.js
```

### 3. Start the Frontend

Open a new terminal, navigate to the frontend directory, and install its dependencies:

```bash
npm install
```

Start the frontend using the appropriate command from its `package.json`, such as `npm start` or `npm run dev`.

## 🔒 Security

The platform uses Docker isolation and resource limits to help control code execution. Assessment restrictions and activity logs help support fair evaluations. Browser restrictions are intended to discourage unwanted actions but cannot guarantee complete prevention.

## 🤝 Contributing

Contributions are welcome! Fork the repository, create a new branch, make your changes, test them, and submit a Pull Request.

## 📄 License

Add the appropriate open-source license if the project does not already have one.

---

**Built to make coding practice and assessments simple, interactive, and reliable.** 🚀
