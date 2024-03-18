    
const AV: f64 = 0.85;  // Attack Vector
const AC: f64 = 0.62;  // Attack Complexity
const PR: f64 = 0.85;  // Privileges Required
const UI: f64 = 0.85;  // User Interaction
const C: f64 = 0.56;   // Confidentiality Impact
const I: f64 = 0.56;   // Integrity Impact
const A: f64 = 0.56;   // Availability Impact

fn main() {
    // Calculate the base score
    let base_score = calculate_base_score(AV, AC, PR, UI, C, I, A);

    println!("CVSS Base Score: {:.1}", base_score);
}

// Function to calculate the base score
fn calculate_base_score(av: f64, ac: f64, pr: f64, ui: f64, c: f64, i: f64, a: f64) -> f64 {
    let exploitability = 20.0 * av * ac * pr * ui;
    let impact = 10.41 * (1.0 - (1.0 - c) * (1.0 - i) * (1.0 - a));
    let base_score_temp = if impact <= 0.0 { 0.0 } else { (0.6 * impact) + (0.4 * exploitability) - 1.5 };

    if base_score_temp <= 0.0 {
        0.0
    } else {
        match base_score_temp {
            x if x <= 3.9 => base_score_temp.round(),
            x if x <= 6.9 => (base_score_temp + 1.0).round(),
            _ => (base_score_temp + 2.0).round(),
        }
    }
}
