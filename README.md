# Echallan-reminder



Welcome to Echallan-reminder, a project aimed at simplifying the process of staying updated about your active traffic challans. This tool leverages web scraping through Puppeteer to retrieve the latest details of your challans and sends you an email reminder if any of your challans are pending. By automating this process, Echallan-reminder ensures that you never miss an important challan update and helps you manage your traffic fines more efficiently.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Current Development Status and Planned Improvements](#Current-Development-Status-and-Planned-Improvements)
- [License](#license)
- [Contact](#contact)

## Introduction

Traffic challans are a common hassle for many individuals, and keeping track of their status can be cumbersome. Echallan-reminder aims to alleviate this issue by automating the process of checking for pending challans and notifying users via email. This project not only benefits individual users but also contributes to better traffic rule compliance and management.

## Features

- **Automated Web Scraping**: Echallan-reminder utilizes Puppeteer, a headless browser automation tool, to scrape the latest challan details from the designated official website.

- **Email Notifications**: Users receive email notifications only when they have pending challans. This helps users focus on active issues without overwhelming their inbox.

- **Daily Reminders**: The scraping and notification process occurs once every day, ensuring that users receive timely updates about their challan status.

- **Effortless Setup**: With simple configuration steps, users can set up Echallan-reminder to work with their specific email address and traffic authority's website.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following prerequisites:

- Node.js (v12 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/e-challan-reminder.git
   cd e-challan-reminder
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

To start using Echallan-reminder, follow these steps:

1. Configure the project by editing the `.env.example` file with your email credentials .

2. Run the application:

   ```bash
   npm start
   ```

3. Sit back and relax! Echallan-reminder will automatically run once every day, scraping your challan details and sending notifications when necessary.

## Configuration

Echallan-reminder requires some initial configuration before use. Edit the `.env.example` file to include:

- Your email address and SMTP server details for sending notifications.
- Any other relevant configuration parameters.


## Contributing

We welcome contributions from the community to make Echallan-reminder even better. To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your enhancements or fixes.
4. Test thoroughly.
5. Create a pull request explaining the changes you've made.

Together, we can improve this tool and make a positive impact on how people manage their traffic challans.


## Testing the current api 
 The current code is deployed on https://echallan.onrender.com/api
 Just hit a POST request with below json object in body
 
 {
   email:YOUR_EMAIL,
   vehicle: YOUR_VEHICLE_NUMBER
 }
  

## Current Development Status and Planned Improvements

Echallan-reminder is currently in the backend development stage, focusing on automating the process of fetching traffic challan data and sending email notifications. The backend functionalities are being implemented using Node.js and Puppeteer for web scraping, along with Gmail Nodemailer for sending notifications.

- [x] Implement backend automation using Node.js and Puppeteer.
- [x] Set up email notifications using Gmail Nodemailer for pending challans.
- [ ] **Planned:** Develop a user-friendly frontend interface for the application.
- [ ] **Planned:** Implement user authentication and user accounts.
- [ ] **Planned:** Enhance email notification templates for improved user engagement.
- [ ] **Planned:** Implement a responsive and intuitive design for mobile users.
- [ ] **Planned:** Integrate user authentication for enhanced security and personalization.
- [ ] **Planned:** Develop additional features based on user feedback and project requirements.

We acknowledge that the project has substantial room for improvement and expansion, particularly in terms of frontend development, user authentication, and user experience. We invite contributors to join us in building these essential components to make Echallan-reminder a comprehensive and user-centric solution.

Your contributions are valuable in shaping the future of this project and helping us achieve our goal of simplifying traffic challan management for everyone.


## License

This project is licensed under the [MIT License](LICENSE).

## Contact

Have questions or suggestions? Feel free to open an issue in the GitHub repository. Your feedback is valuable!

---

By contributing to Echallan-reminder, you're helping countless individuals stay informed about their pending challans and contribute to better traffic compliance. Thank you for making a difference!
