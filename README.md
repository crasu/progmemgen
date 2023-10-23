# Header File Generation Utility

This TypeScript module provides a utility for generating C header files from web resources (ts, js, ...), primarily designed for use with microcontroller programming. The generated header files store the contents of input files as constant character arrays, making it easy to include data files in your C projects.

## Getting Started

### Prerequisites

Before using this utility, ensure you have the following installed:

-   Node.js (at least version 16 or higher)
-   npm (Node Package Manager)

### Run it

```bash
npx https://github.com/crasu/progmemgen
```

### Installation

```bash
npm install progmemgen
```

## Usage

From cli

```bash
npx progmemgen input.html input.js output.h
```

This function generates a C/C++ header file from an array of JavaScript file paths.

```javascript
generateHeaderFile(jsFiles: string[], headerFilename?: string)
```

-   `jsFiles`: An array of JavaScript file paths that you want to include in the header file.

-   `headerFilename` (optional): The name of the output header file. If not provided, it defaults to 'index.h'.

Example usage:

```javascript
const jsFiles = ['file1.js', 'file2.js', 'file3.js'];
generateHeaderFile(jsFiles, 'myHeader.h');
```

## License

This utility is provided under the [MIT License](LICENSE). Feel free to modify and use it in your projects as needed.
