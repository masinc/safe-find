use std::env;
use std::process;
use safe_find::{check_dangerous_options, execute_command, FD_DANGEROUS_OPTIONS};

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    
    // Check for dangerous options
    if let Err(error) = check_dangerous_options(&args, FD_DANGEROUS_OPTIONS) {
        eprintln!("{}", error);
        process::exit(1);
    }
    
    // Execute the original fd command
    match execute_command("fd", &args) {
        Ok(status) => {
            if let Some(code) = status.code() {
                process::exit(code);
            } else {
                // Process was terminated by a signal
                process::exit(1);
            }
        }
        Err(error) => {
            eprintln!("Error executing fd command: {}", error);
            process::exit(1);
        }
    }
}