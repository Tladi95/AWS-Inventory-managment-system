## Overview

This project is a full-stack Inventory Management System designed to streamline inventory tracking and management. The application provides essential CRUD (Create, Read, Update, Delete) operations for managing inventory records efficiently.

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Web Server:** NGINX Reverse Proxy
- **Containerization:** Docker

## Architecture

The frontend is built with React and TypeScript, providing a responsive and user-friendly interface. The backend is developed using Node.js and exposes RESTful APIs that interact with a PostgreSQL database for persistent data storage.

An NGINX reverse proxy sits in front of the backend services, adding an extra layer of security by preventing direct access to application services and efficiently routing incoming requests.

Both the frontend and backend applications are containerized using **Docker**, ensuring consistent deployments, environment portability, and compatibility across different systems and configurations.

## Features

- Inventory item management
- Create, Read, Update, and Delete (CRUD) operations
- RESTful API integration
- PostgreSQL database connectivity
- Secure request routing with NGINX
- Dockerized deployment for easy setup and scalability
