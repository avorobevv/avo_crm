# Personal CRM

A lightweight personal CRM that can be launched directly from the terminal using the `personal-crm` command.

## Overview

This project provides a simple command-line entry point to open and run the Personal CRM application.  
After adding the project’s `bin` directory to your PATH, you can start the CRM from anywhere in your terminal.

## Setup

Clone the repository:

```bash
git clone https://github.com/avorobev/avo_crm.git
cd avo_crm
```

Add the project's `bin` directory to your shell PATH:

```bash
echo 'export PATH="/Users/avorobev/projects/personal_crm/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Usage

Once the PATH is configured, you can launch the CRM from anywhere:

```bash
personal-crm
```

This command runs the executable script located in:

```
bin/personal-crm
```

## Project Structure

```
personal_crm/
├── bin/
│   └── personal-crm
├── README.md
└── ...
```

## Requirements

- macOS / Linux terminal
- zsh or compatible shell

## Notes

If the command is not recognized, confirm your PATH is updated:

```bash
echo $PATH
```

You should see:

```
/Users/avorobev/projects/personal_crm/bin
```

## License

MIT
