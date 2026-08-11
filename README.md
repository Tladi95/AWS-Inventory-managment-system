## Overview
2
 
3
This project is a full-stack **Inventory Management System** designed to streamline inventory tracking and management. The application provides essential CRUD (Create, Read, Update, Delete) operations for managing inventory records efficiently.
4
 
5
## Tech Stack
6
 
7
- **Frontend:** React, TypeScript
8
- **Backend:** Node.js, Express.js
9
- **Database:** PostgreSQL
10
- **Web Server:** NGINX Reverse Proxy
11
- **Containerization:** Docker
12
 
13
## Architecture
14
 
15
The frontend is built with **React and TypeScript**, providing a responsive and user-friendly interface. The backend is developed using **Node.js** and exposes RESTful APIs that interact with a **PostgreSQL** database for persistent data storage.
16
 
17
An **NGINX reverse proxy** sits in front of the backend services, adding an extra layer of security by preventing direct access to application services and efficiently routing incoming requests.
18
 
19
Both the frontend and backend applications are containerized using **Docker**, ensuring consistent deployments, environment portability, and compatibility across different systems and configurations.
20
 
21
## Features
22
 
23
- Inventory item management
24
- Create, Read, Update, and Delete (CRUD) operations
25
- RESTful API integration
26
- PostgreSQL database connectivity
27
- Secure request routing with NGINX
28
- Dockerized deployment for easy setup and scalability
