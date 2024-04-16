use std::collections::HashMap;
use std::fs;
use std::io::{self, BufRead};
use std::ffi::OsStr;

struct Vulnerability {
    cvss_score: f64,
    epss_score: f64,
    file_path: String,
    keyword: String,
}

fn read_keywords_from_files(file_paths: &[&str]) -> io::Result<HashMap<String, String>> {
    let mut keywords = HashMap::new();

    for file_path in file_paths {
        let file = fs::File::open(file_path)?;
        let reader = io::BufReader::new(file);

        for line in reader.lines() {
            let line = line?;
            let keyword = line.trim().to_string(); // Trim whitespace
            keywords.insert(keyword.clone(), file_path.to_string());
        }
    }

    Ok(keywords)
}

fn search_keywords_in_file(
    file_path: &str,
    keywords: &HashMap<String, String>,
    vulnerabilities: &mut Vec<Vulnerability>,
    keyword_weights: &HashMap<&str, f64>,
) -> io::Result<()> {
    let file = fs::File::open(file_path)?;
    let reader = io::BufReader::new(file);

    for line in reader.lines() {
        let line = line?;
        for (keyword, source_file) in keywords.iter() {
            if line.contains(keyword) {
                let cvss_score = calculate_cvss_score();
                let epss_score = calculate_epss_score(source_file, keyword_weights);
                vulnerabilities.push(Vulnerability {
                    cvss_score,
                    epss_score,
                    file_path: file_path.to_string(),
                    keyword: keyword.clone(), // Store the found keyword
                });
                break;
            }
        }
    }

    Ok(())
}

fn search_keywords_in_folder(
    folder_path: &str,
    keywords: &HashMap<String, String>,
    extensions: &[&str],
    vulnerabilities: &mut Vec<Vulnerability>,
    keyword_weights: &HashMap<&str, f64>,
) -> io::Result<()> {
    for entry in fs::read_dir(folder_path)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() {
            if let Some(file_name) = path.file_name() {
                if let Some(file_name_str) = file_name.to_str() {
                    if let Some(ext) = path.extension().and_then(OsStr::to_str) {
                        if extensions.contains(&ext) {
                            match search_keywords_in_file(
                                &path.to_string_lossy(),
                                keywords,
                                vulnerabilities,
                                keyword_weights,
                            ) {
                                Ok(_) => {} // No keywords found, do nothing
                                Err(e) => {
                                    eprintln!(
                                        "Error while searching in file {}: {}",
                                        file_name_str, e
                                    );
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

fn calculate_cvss_score() -> f64 {
    // Implement CVSS calculation logic here
    // For demonstration, let's assume a static CVSS score
    7.5
}

fn calculate_epss_score(source_file: &str, keyword_weights: &HashMap<&str, f64>) -> f64 {
    // Assign EPSS score based on keyword source
    // For demonstration, let's use predefined weights
    match keyword_weights.get(source_file) {
        Some(weight) => *weight,
        None => 0.0,
    }
}

fn prioritize_vulnerabilities(vulnerabilities: Vec<Vulnerability>) {
    let mut prioritized_vulnerabilities: Vec<_> = vulnerabilities.into_iter().collect();
    prioritized_vulnerabilities.sort_by(|a, b| {
        let combined_score_a = combine_cvss_and_epss(a.cvss_score, a.epss_score);
        let combined_score_b = combine_cvss_and_epss(b.cvss_score, b.epss_score);
        combined_score_a.partial_cmp(&combined_score_b).unwrap_or(std::cmp::Ordering::Equal)
    });

    for vuln in prioritized_vulnerabilities.iter().rev() {
        println!(
            "File: '{}', Keyword: '{}', CVSS Score: {}, EPSS Score: {}",
            vuln.file_path, vuln.keyword, vuln.cvss_score, vuln.epss_score
        );
    }
}

fn combine_cvss_and_epss(cvss_score: f64, epss_score: f64) -> f64 {
    // Combine CVSS and EPSS scores using a weighted sum or other method
    // For demonstration, let's use a simple weighted sum
    let cvss_weight = 0.6;
    let epss_weight = 0.4;
    (cvss_score * cvss_weight) + (epss_score * epss_weight)
}

fn main() {
    let folder_path = "C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts";
    let keywords_files = [
        "C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/critical.txt",
        "C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/high.txt",
        "C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/informational.txt",
        "C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/low.txt",
        "C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/medium.txt",
        
        // "/home/kartik/Desktop/criticality/critical.txt",
        // "/home/kartik/Desktop/criticality/high.txt",
        // "/home/kartik/Desktop/criticality/informational.txt",
        // "/home/kartik/Desktop/criticality/low.txt",
        // "/home/kartik/Desktop/criticality/medium.txt",
    ];

    let keywords = match read_keywords_from_files(&keywords_files) {
        Ok(keywords) => keywords,
        Err(e) => {
            eprintln!("Error reading keywords from files: {}", e);
            return;
        }
    };

    let extensions = &[
        "txt", "java", "py", "c", "cpp", "cs", "html", "css", "js", "php", "sql", "json", "xml",
        "rb", "swift", "kt", "pl", "sh", "asm", "jsp", "tsx",
    ];

    let mut vulnerabilities = Vec::new();

    // Define weights for different keyword sources
    let mut keyword_weights = HashMap::new();
    keyword_weights.insert("C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/critical.txt", 2.0);
    keyword_weights.insert("C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/high.txt", 4.0);
    keyword_weights.insert("C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/informational.txt", 6.0);
    keyword_weights.insert("C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/low.txt", 8.0);
    keyword_weights.insert("C:/Users/owais/Desktop/Projects/secrets-scanning-engine/scripts/criticality/medium.txt", 10.0);

    if let Err(e) = search_keywords_in_folder(
        folder_path,
        &keywords,
        extensions,
        &mut vulnerabilities,
        &keyword_weights,
    ) {
        eprintln!("Error: {}", e);
        return;
    }

    prioritize_vulnerabilities(vulnerabilities);
}
