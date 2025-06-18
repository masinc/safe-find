use std::process::Command;

/// Helper function to run commands and capture output
fn run_command(bin_name: &str, args: &[&str]) -> (bool, String, String) {
    let mut cmd = Command::new("cargo");
    cmd.arg("run").arg("--bin").arg(bin_name);

    if !args.is_empty() {
        cmd.arg("--").args(args);
    }

    let output = cmd.output().expect("Failed to execute command");

    let success = output.status.success();
    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    (success, stdout, stderr)
}

#[test]
fn test_safe_find_with_safe_options() {
    let (success, stdout, _stderr) =
        run_command("safe-find", &[".", "-name", "*.rs", "-type", "f"]);

    assert!(
        success,
        "safe-find should execute successfully with safe options"
    );
    assert!(!stdout.is_empty(), "safe-find should find Rust files");
}

#[test]
fn test_safe_find_blocks_exec_option() {
    let (success, _stdout, stderr) = run_command("safe-find", &[".", "-exec", "echo", "test", ";"]);

    assert!(!success, "safe-find should fail when -exec is used");
    assert!(
        stderr.contains("Dangerous option") && stderr.contains("-exec"),
        "Error message should mention dangerous -exec option"
    );
}

#[test]
fn test_safe_find_blocks_delete_option() {
    let (success, _stdout, stderr) = run_command("safe-find", &[".", "-name", "*.tmp", "-delete"]);

    assert!(!success, "safe-find should fail when -delete is used");
    assert!(
        stderr.contains("Dangerous option") && stderr.contains("-delete"),
        "Error message should mention dangerous -delete option"
    );
}

#[test]
fn test_safe_find_blocks_execdir_option() {
    let (success, _stdout, stderr) =
        run_command("safe-find", &[".", "-execdir", "echo", "test", ";"]);

    assert!(!success, "safe-find should fail when -execdir is used");
    assert!(
        stderr.contains("Dangerous option") && stderr.contains("-execdir"),
        "Error message should mention dangerous -execdir option"
    );
}

#[test]
fn test_safe_fd_with_safe_options() {
    let (success, stdout, _stderr) = run_command("safe-fd", &["--glob", "*.rs"]);

    assert!(
        success,
        "safe-fd should execute successfully with safe options"
    );
    assert!(!stdout.is_empty(), "safe-fd should find Rust files");
}

#[test]
fn test_safe_fd_blocks_exec_option() {
    let (success, _stdout, stderr) = run_command("safe-fd", &["--glob", "*.rs", "-x", "echo"]);

    assert!(!success, "safe-fd should fail when -x is used");
    assert!(
        stderr.contains("Dangerous option") && stderr.contains("-x"),
        "Error message should mention dangerous -x option"
    );
}

#[test]
fn test_safe_fd_blocks_exec_long_option() {
    let (success, _stdout, stderr) = run_command("safe-fd", &["--glob", "*.rs", "--exec", "echo"]);

    assert!(!success, "safe-fd should fail when --exec is used");
    assert!(
        stderr.contains("Dangerous option") && stderr.contains("--exec"),
        "Error message should mention dangerous --exec option"
    );
}

#[test]
fn test_safe_fd_blocks_list_details_option() {
    let (success, _stdout, stderr) = run_command("safe-fd", &["--glob", "*.rs", "--list-details"]);

    assert!(!success, "safe-fd should fail when --list-details is used");
    assert!(
        stderr.contains("Dangerous option") && stderr.contains("--list-details"),
        "Error message should mention dangerous --list-details option"
    );
}

#[test]
fn test_safe_find_help_shows_wrapper_info() {
    let (success, stdout, _stderr) = run_command("safe-find", &["--help"]);

    assert!(success, "safe-find --help should execute successfully");
    assert!(
        stdout.contains("safe-find") && stdout.contains("secure wrapper"),
        "Help output should show safe-find wrapper information"
    );
}

#[test]
fn test_safe_fd_version_shows_wrapper_info() {
    let (success, stdout, _stderr) = run_command("safe-fd", &["--version"]);

    assert!(success, "safe-fd --version should execute successfully");
    assert!(
        stdout.contains("safe-fd") && stdout.contains("secure wrapper"),
        "Version output should show safe-fd wrapper information"
    );
}
