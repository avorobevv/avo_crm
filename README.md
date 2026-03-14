# Personal CRM

A lightweight personal CRM that can be launched directly from the terminal using the `personal-crm` command.

## Overview

This project provides a simple command-line entry point to open and run the Personal CRM application.  
After adding the project’s `bin` directory to your PATH, you can start the CRM from anywhere in your terminal.

## Setup

Clone the repository:

```bash
   git clone [https://github.com/avorobevv/avo_crm.git](https://github.com/avorobevv/avo_crm.git)
   cd avo_crm/personal_crm
```

Install dependencies:
```bash
npm install
```

Add the project's `bin` directory to your shell PATH:

```bash
echo "export PATH=\"$(pwd)/bin:\$PATH\"" >> ~/.zshrc
source ~/.zshrc
```

## Usage

Once the PATH is configured, you can launch the CRM from anywhere in your terminal:

```bash
personal-crm dev
```

The application will be accessible at http://127.0.0.1:8000.

## Project Structure

```
personal_crm/
├── bin/
│   └── personal-crm
├── README.md
└── ...
```

## Requirements

- Node.js (v22.0.0 or higher)
- macOS / Linux terminal
- zsh or compatible shell

## Troubleshooting

If the command is not recognized, confirm your PATH is updated:

```bash
echo $PATH
```

You should see:

```
/Users/avorobev/projects/personal_crm/bin
```

"Cannot find module '.../dist/server.js'": This occurs if you run personal-crm without building the project. Use personal-crm dev instead, or run npm run build first.

node:sqlite errors: Ensure you are running Node v22+ by checking node -v.

## License

MIT
