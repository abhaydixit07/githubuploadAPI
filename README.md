# githubuploadAPI


This repository contains the code to directly upload your files (here I have used PDFs) to GitHub using the GitHub API.

## Tech Stack 👨‍💻

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- Body-parser
- JavaScript
- Passport.js for Authentication

## Getting Started

### Prerequisites
1. **Change the code with necessary collections and db**
2. **Create a upload folder in root directory to store file temprarily while uploading**

3. **Form the .env file with following contents**
    : here i have used local mongo compass, you can add mongo atlas url also but do necessary changes in code
   ```bash
   GITHUB_TOKEN=
   GITHUB_USERNAME=
   GITHUB_REPO=
   USER=
   PASSWORD=
   
   MONGO_ATLAS_URL=
#### How to Get a GitHub Token

1. **Sign in to GitHub**:
   - Go to the GitHub website (github.com) and sign in to your account.

2. **Access Personal Access Tokens settings**:
   - Click on your profile icon in the top-right corner of the page.
   - Select "Settings" from the dropdown menu.
   - In the left sidebar, click on "Developer settings".
   - Then click on "Personal access tokens".

3. **Generate a new token**:
   - Click on the "Generate new token" button.
   - You may need to enter your GitHub password for confirmation.
   - Give your token a descriptive name.
   - Select the scopes or permissions for your token. For your use case, you might need `repo` scope if you want to access repositories.
   - Click on "Generate token".

4. **Copy the token**: Once the token is generated, copy it immediately. GitHub will not show it again.

5. **Store the token securely**: Treat your token like a password. Store it securely, and avoid sharing it publicly.

6. **Use the token in your application**: Now, you can use this token in your application for GitHub API authentication.


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



