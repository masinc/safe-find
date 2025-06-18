use safe_find::{check_dangerous_options, execute_command, FIND_DANGEROUS_OPTIONS};
use std::env;
use std::process;

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();

    // Check for dangerous options
    if let Err(error) = check_dangerous_options(&args, FIND_DANGEROUS_OPTIONS) {
        eprintln!("{}", error);
        process::exit(1);
    }

    // Execute the original find command
    match execute_command("find", &args) {
        Ok(status) => {
            if let Some(code) = status.code() {
                process::exit(code);
            } else {
                // Process was terminated by a signal
                process::exit(1);
            }
        }
        Err(error) => {
            eprintln!("Error executing find command: {}", error);
            process::exit(1);
        }
    }
}
