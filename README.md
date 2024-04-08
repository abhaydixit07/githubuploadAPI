# githubuploadAPI


This repository contains the code to directly upload your files (here I have used PDFs) to GitHub using the GitHub API.

## Tech Stack 👨‍💻

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- Body-parser
- JavaScript

## Getting Started

### Prerequisites

1. **Form the .env file with following contents**
    : here i have used local mongo compass, you can add mongo atlas url also but do necessary changes in code
   ```bash
   GITHUB_TOKEN=
   GITHUB_USERNAME=
   GITHUB_REPO=
   
   MONGO_ATLAS_URL=


2. **Change the code with necessary collections and db**
3. **Create a upload folder in root directory to store file temprarily while uploading**


### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/abhaydixit07/githubuploadAPI.git
2. **Navigate to the project directory:**

   ```bash
   cd githubuploadAPI
3. **Install dependencies:**
   ```bash
   npm install
 

4. **Run the application:**
   ```bash
   node index.js

**The application will be accessible at http://localhost:3000 by default.**



