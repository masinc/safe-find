#!/usr/bin/env -S deno run --allow-run

/**
 * Safe wrapper for find command that rejects dangerous execution options
 */

// Dangerous options that allow arbitrary command execution or destructive operations
export const DANGEROUS_OPTIONS = new Set([
  "-exec", // Execute arbitrary commands
  "-execdir", // Execute commands in file's directory
  "-ok", // Interactive command execution
  "-okdir", // Interactive command execution in file's directory
  "-delete", // Delete matched files/directories - extremely dangerous
]);

export function checkDangerousOptions(args: string[]): void {
  let skipNext = false;

  for (let i = 0; i < args.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }

    const arg = args[i];

    // Check for dangerous options
    if (DANGEROUS_OPTIONS.has(arg)) {
      throw new Error(
        `Dangerous option '${arg}' is not allowed for security reasons`,
      );
    }

    // Check for combined options (though find doesn't typically use these)
    for (const dangerousOpt of DANGEROUS_OPTIONS) {
      if (arg.startsWith(dangerousOpt + "=")) {
        throw new Error(
          `Dangerous option '${dangerousOpt}' is not allowed for security reasons`,
        );
      }
    }
  }
}

async function runSafeFind(args: string[]): Promise<void> {
  try {
    checkDangerousOptions(args);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    Deno.exit(1);
  }

  try {
    const command = new Deno.Command("find", {
      args: args,
      stdout: "inherit",
      stderr: "inherit",
    });

    const process = command.spawn();
    const status = await process.status;

    if (!status.success) {
      Deno.exit(status.code || 1);
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(
        "Error: 'find' command not found. Please install findutils.",
      );
      Deno.exit(1);
    } else {
      console.error(
        `Error running find: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      Deno.exit(1);
    }
  }
}

if (import.meta.main) {
  const args = Deno.args;
  await runSafeFind(args);
}
