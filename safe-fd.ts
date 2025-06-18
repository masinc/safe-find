#!/usr/bin/env -S deno run --allow-run

/**
 * Safe wrapper for fd command that rejects dangerous execution options
 */

// Dangerous options that allow arbitrary command execution
export const DANGEROUS_OPTIONS = new Set([
  "-x",
  "--exec",
  "-X",
  "--exec-batch",

  // Uses 'ls' internally, potential security risk if ls binary is compromised
  "-l",
  "--list-details",
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

    // Check for combined options like -x'command' or --exec='command'
    for (const dangerousOpt of DANGEROUS_OPTIONS) {
      if (
        arg.startsWith(dangerousOpt + "=") ||
        (dangerousOpt.length === 2 && arg.startsWith(dangerousOpt))
      ) {
        throw new Error(
          `Dangerous option '${dangerousOpt}' is not allowed for security reasons`,
        );
      }
    }
  }
}

async function runSafeFd(args: string[]): Promise<void> {
  try {
    checkDangerousOptions(args);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    Deno.exit(1);
  }

  try {
    const command = new Deno.Command("fd", {
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
      console.error("Error: 'fd' command not found. Please install fd first.");
      Deno.exit(1);
    } else {
      console.error(
        `Error running fd: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      Deno.exit(1);
    }
  }
}

if (import.meta.main) {
  const args = Deno.args;
  await runSafeFd(args);
}
