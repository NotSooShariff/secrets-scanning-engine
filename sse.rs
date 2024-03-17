use std::fs;
use std::io::{self, BufRead};
use std::ffi::OsStr;

fn read_keywords_from_file(file_path: &str) -> io::Result<Vec<String>> {
    let file = fs::File::open(file_path)?;
    let reader = io::BufReader::new(file);
    let mut keywords = Vec::new();

    for line in reader.lines() {
        let line = line?;
        keywords.push(line.trim().to_string());
    }

    Ok(keywords)
}

fn search_keywords_in_file(file_path: &str, keywords: &[String]) -> io::Result<Vec<String>> {
    let file = fs::File::open(file_path)?;
    let reader = io::BufReader::new(file);
    let mut found_keywords = Vec::new();

    for line in reader.lines() {
        let line = line?;
        for keyword in keywords {
            if line.contains(keyword) {
                found_keywords.push(keyword.clone());
                break;
            }
        }
    }

    Ok(found_keywords)
}

fn search_keywords_in_folder(folder_path: &str, keywords: &[String], extensions: &[&str]) -> io::Result<()> {
    for entry in fs::read_dir(folder_path)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() {
            if let Some(file_name) = path.file_name() {
                if let Some(file_name_str) = file_name.to_str() {
                    if let Some(ext) = path.extension().and_then(OsStr::to_str) {
                        if extensions.contains(&ext) {
                            match search_keywords_in_file(&path.to_string_lossy(), keywords) {
                                Ok(found_keywords) if !found_keywords.is_empty() => {
                                    println!("Keywords found in file '{}': {:?}", file_name_str, found_keywords);
                                }
                                Ok(_) => {} // No keywords found, do nothing
                                Err(e) => {
                                    eprintln!("Error while searching in file {}: {}", file_name_str, e);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    Ok(())
}

fn main() {
    let folder_path = "/home/kartik/Desktop/SSE";
    let keywords_file_path = "/home/kartik/Desktop/keywords.txt";

    let keywords = match read_keywords_from_file(keywords_file_path) {
        Ok(keywords) => keywords,
        Err(e) => {
            eprintln!("Error reading keywords from file {}: {}", keywords_file_path, e);
            return;
        }
    };

    let extensions = &[
        "txt", "java", "py", "c", "cpp", "cs", "html", "css", "js", "php", "sql", "json", "xml", "rb", "swift", "kt", "pl", "sh", "asm", "jsp", "tsx",
    ];

    match search_keywords_in_folder(folder_path, &keywords, extensions) {
        Ok(()) => println!("Search completed."),
        Err(e) => eprintln!("Error: {}", e),
    }
}
