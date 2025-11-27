const config = require('../config/config');

class LanguageService {
    getSupportedLanguages() {
        const languages = [];
        
        for (const [key, value] of Object.entries(config.LANGUAGES)) {
            languages.push({
                id: key,
                name: value.name,
                extension: value.extension
            });
        }
        
        return languages;
    }

    isLanguageSupported(language) {
        return config.LANGUAGES.hasOwnProperty(language);
    }

    getLanguageConfig(language) {
        return config.LANGUAGES[language] || null;
    }

    getBoilerplate(language) {
        const boilerplates = {
            javascript: `// JavaScript Code
console.log("Hello, Codvia!");`,
            
            python: `# Python Code
print("Hello, Codvia!")`,
            
            cpp: `// C++ Code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Codvia!" << endl;
    return 0;
}`,
            
            c: `// C Code
#include <stdio.h>

int main() {
    printf("Hello, Codvia!\\n");
    return 0;
}`,
            
            java: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Codvia!");
    }
}`,
            
            typescript: `// TypeScript Code
const message: string = "Hello, Codvia!";
console.log(message);`,
            
            ruby: `# Ruby Code
puts "Hello, Codvia!"`,
            
            go: `// Go Code
package main

import "fmt"

func main() {
    fmt.Println("Hello, Codvia!")
}`,
            
            php: `<?php
// PHP Code
echo "Hello, Codvia!";
?>`,
            
            rust: `// Rust Code
fn main() {
    println!("Hello, Codvia!");
}`
        };

        return boilerplates[language] || '// Write your code here';
    }
}

module.exports = new LanguageService();
