use std::collections::HashSet;
use std::process::{Command, ExitStatus};

/// Dangerous options for the find command
pub const FIND_DANGEROUS_OPTIONS: &[&str] = &["-exec", "-execdir", "-ok", "-okdir", "-delete"];

/// Dangerous options for the fd command  
pub const FD_DANGEROUS_OPTIONS: &[&str] =
    &["-x", "--exec", "-X", "--exec-batch", "-l", "--list-details"];

/// Check if any dangerous options are present in the arguments
pub fn check_dangerous_options(args: &[String], dangerous_options: &[&str]) -> Result<(), String> {
    let dangerous_set: HashSet<&str> = dangerous_options.iter().copied().collect();

    for arg in args {
        if dangerous_set.contains(arg.as_str()) {
            return Err(format!(
                "Error: Dangerous option '{}' is not allowed for security reasons",
                arg
            ));
        }
    }

    Ok(())
}

/// Execute a command with the given arguments
pub fn execute_command(command_name: &str, args: &[String]) -> Result<ExitStatus, std::io::Error> {
    let mut cmd = Command::new(command_name);
    cmd.args(args);
    cmd.status()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_check_dangerous_options_find() {
        let safe_args = vec![".", "-name", "*.txt", "-type", "f"]
            .into_iter()
            .map(String::from)
            .collect::<Vec<_>>();
        assert!(check_dangerous_options(&safe_args, FIND_DANGEROUS_OPTIONS).is_ok());

        let dangerous_args = vec![".", "-name", "*.txt", "-exec", "rm", "{}", ";"]
            .into_iter()
            .map(String::from)
            .collect::<Vec<_>>();
        assert!(check_dangerous_options(&dangerous_args, FIND_DANGEROUS_OPTIONS).is_err());
    }

    #[test]
    fn test_check_dangerous_options_fd() {
        let safe_args = vec!["*.js", "--type", "f"]
            .into_iter()
            .map(String::from)
            .collect::<Vec<_>>();
        assert!(check_dangerous_options(&safe_args, FD_DANGEROUS_OPTIONS).is_ok());

        let dangerous_args = vec!["*.js", "-x", "rm"]
            .into_iter()
            .map(String::from)
            .collect::<Vec<_>>();
        assert!(check_dangerous_options(&dangerous_args, FD_DANGEROUS_OPTIONS).is_err());
    }
}
