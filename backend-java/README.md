# AI Resume Builder - Spring Boot Backend

## Tech Stack
- **Spring Boot 3.2.0** - REST API framework
- **Spring Data JPA** - Database operations with SQL
- **Spring Security** - Authentication & Authorization
- **JWT** - Secure token-based authentication
- **MySQL/PostgreSQL** - Relational database
- **Google Gemini AI** - AI content generation
- **Maven** - Build tool

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ or PostgreSQL 14+ running on localhost
- Gemini API Key

## Setup Instructions

### 1. Install Java & Maven
Make sure you have Java 17+ and Maven installed:
```bash
java -version
mvn -version
```

### 2. Setup Database

**Option A: MySQL (Recommended)**
```bash
# Install MySQL from https://dev.mysql.com/downloads/mysql/

# Create database
mysql -u root -p
CREATE DATABASE resume_db;
EXIT;
```

**Option B: PostgreSQL**
```bash
# Install PostgreSQL from https://www.postgresql.org/download/

# Create database
psql -U postgres
CREATE DATABASE resume_db;
\q
```

**Option C: Docker (Easiest)**
```bash
# MySQL
docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=resume_db mysql:8

# PostgreSQL
docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=resume_db postgres:14
```

### 3. Configure Database Connection
Edit `src/main/resources/application.properties`:

For MySQL (default):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/resume_db
spring.datasource.username=root
spring.datasource.password=root
```

For PostgreSQL (uncomment in file):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/resume_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 4. Configure Environment Variables
Edit the `.env` file:
```
GEMINI_API_KEY=your-gemini-api-key-here
DB_USERNAME=root
DB_PASSWORD=root
```

### 5. Build the Project
```bash
mvn clean install
```

### 6. Run the Application
```bash
mvn spring-boot:run
```

Or run the JAR file:
```bash
java -jar target/resume-builder-1.0.0.jar
```

The server will start on `http://localhost:8080`

Tables will be created automatically by Hibernate!

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT)

### Resume Management
- `POST /api/resume` - Create new resume
- `GET /api/resumes` - Get all user resumes
- `GET /api/resume/{id}` - Get specific resume
- `PUT /api/resume/{id}` - Update resume
- `DELETE /api/resume/{id}` - Delete resume

### AI Features
- `POST /api/ai/generate` - Generate AI content (summary, bullets, etc.)
- `POST /api/ats/calculate` - Calculate ATS score

### Health Check
- `GET /api/` - API info
- `GET /api/health` - Health status

## Project Structure
```
backend-java/
├── src/main/java/com/resumeai/
│   ├── ResumeBuilderApplication.java
│   ├── config/
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ResumeController.java
│   │   ├── AIController.java
│   │   └── HealthController.java
│   ├── dto/
│   │   ├── AuthRequest.java
│   │   ├── SignupRequest.java
│   │   ├── AuthResponse.java
│   │   └── AIGenerateRequest.java
│   ├── model/
│   │   ├── User.java
│   │   └── Resume.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── ResumeRepository.java
│   ├── security/
│   │   ├── JwtUtil.java
│   │   └── JwtAuthenticationFilter.java
│   └── service/
│       ├── AuthService.java
│       ├── ResumeService.java
│       ├── AIService.java
│       ├── GeminiService.java
│       └── ATSService.java
└── src/main/resources/
    └── application.properties
```

## Configuration

### application.properties
Key configurations:
- `server.port` - Server port (default: 8080)
- `spring.datasource.url` - Database connection URL
- `spring.datasource.username` - Database username
- `spring.datasource.password` - Database password
- `spring.jpa.hibernate.ddl-auto` - Auto create/update tables (update)
- `jwt.secret` - JWT secret key
- `jwt.expiration` - Token expiration time
- `gemini.api.key` - Gemini API key

### Database Schema
Tables are automatically created by Hibernate:
- `users` - User accounts
- `resumes` - Resume data with JSON columns for flexible data

## Security
- Passwords are hashed using BCrypt
- JWT tokens expire after 7 days
- CORS enabled for frontend origins
- All endpoints except auth require JWT authentication

## Development

### Run in Development Mode
```bash
mvn spring-boot:run
```

### Build for Production
```bash
mvn clean package
java -jar target/resume-builder-1.0.0.jar
```

### Run Tests
```bash
mvn test
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL/PostgreSQL is running
- Check username/password in application.properties
- Verify database exists: `SHOW DATABASES;` (MySQL) or `\l` (PostgreSQL)

### Gemini API Issues
- Verify your API key is correct
- Check API quota and limits

### Port Already in Use
Change the port in application.properties:
```properties
server.port=8081
```

### JSON Column Issues (MySQL)
If you get JSON errors, ensure MySQL 5.7.8+ or use TEXT columns instead.
