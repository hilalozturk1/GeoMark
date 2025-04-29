
## Next.js + Chakra UI Map Application - Vercel Deployment

### Project Overview

This project is a **Next.js** application built with **Chakra UI**, designed around an interactive map. Users can add, edit, and customize locations on the map. The app also calculates the total distance between saved locations and displays them on the map. Additionally, it can be deployed to **Vercel** automatically using **GitHub Actions**.

### Features

1. **Interactive Map**:
   - Users can add locations by clicking on the map.
   - Locations are customizable with a name, color, and coordinates.
   - Displays the user's current location on the map.
   - Calculates and shows the total distance between saved locations.

2. **Location Management**:
   - **Add/Edit Locations**: Click on the map to add a location. Edit existing locations by selecting and modifying them.
   - **Location Color**: Each location can have its own color for better visual identification.
   - **Total Distance**: The app calculates the total route distance between all saved locations.
   - **User's Location**: The app detects and shows the user's current position on the map.

### Technologies Used

- **Next.js**: A powerful React framework used for building modern web applications.
- **Chakra UI**: A UI component library for React that makes it easy to build accessible and responsive web apps.
- **Vercel**: A cloud platform optimized for deploying Next.js applications.
- **GitHub Actions**: Used for automating deployment workflows.
- **Vercel CLI**: The command-line tool to deploy applications to Vercel.


### Prerequisites

- Node.js >=18.x

### Key Application Features
- **Interactive Map**: Add or edit locations by clicking on the map. Each location can be customized with a color and name.

- **Distance Calculation**: The app calculates the total distance between all saved locations.

- **User Location**: The app displays the user's current location on the map.

### GitHub Actions Workflow
The deployment process is automated using GitHub Actions. Every time you push to the main branch, the app is automatically deployed to Vercel. Here’s the configuration:

    name: Deploy Next.js to Vercel

    on:
      push:
        branches:
            - main
    jobs:
        deploy:
            runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build

      - name: Download Vercel CLI
        run: |
          curl -sL https://github.com/vercel/vercel/releases/download/v24.0.0/vercel-24.0.0-linux-x64.tar.gz -o vercel.tar.gz
          file vercel.tar.gz
          tar -xzvf vercel.tar.gz
          ./vercel --prod --token $VERCEL_TOKEN 

      - name: Clean up Vercel CLI
        run: rm -rf vercel.tar.gz vercel



### Conclusion
This project demonstrates how to build an interactive map application with **Next.js** and **Chakra UI**. The app allows users to manage locations and calculate distances. It also shows how to automate deployment using **GitHub Actions** and **Vercel**.
