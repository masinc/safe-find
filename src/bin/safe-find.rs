use safe_find::{check_dangerous_options, execute_command, FIND_DANGEROUS_OPTIONS};
use std::env;
use std::process;

const VERSION: &str = env!("CARGO_PKG_VERSION");

fn print_safe_find_info() {
    println!("safe-find {} - A secure wrapper for the find command", VERSION);
    println!("Blocks dangerous execution options: -exec, -execdir, -ok, -okdir, -delete");
    println!("Repository: https://github.com/masinc/safe-find");
    println!();
}

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();

    // Show safe-find info for help and version requests
    if args.contains(&"--help".to_string()) || args.contains(&"-h".to_string()) ||
       args.contains(&"--version".to_string()) || args.contains(&"-V".to_string()) {
        print_safe_find_info();
    }

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
