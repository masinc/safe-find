/**
 * Command integration tests for safe-find and safe-fd
 */

import { assert, assertEquals } from "@std/assert";

async function runCommand(
  cmd: string,
  args: string[],
): Promise<{ success: boolean; output: string; stderr: string }> {
  try {
    const command = new Deno.Command(cmd, {
      args: args,
      stdout: "piped",
      stderr: "piped",
    });

    const result = await command.output();

    return {
      success: result.code === 0,
      output: new TextDecoder().decode(result.stdout),
      stderr: new TextDecoder().decode(result.stderr),
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
}

Deno.test("safe-find integration - executes with safe options", async () => {
  const result = await runCommand("deno", [
    "run",
    "--allow-run",
    "safe-find.ts",
    ".",
    "-name",
    "*.ts",
    "-type",
    "f",
  ]);

  assert(
    result.success,
    "safe-find should execute successfully with safe options",
  );
  assert(result.output.length > 0, "safe-find should find TypeScript files");
});

Deno.test("safe-find integration - blocks -exec option", async () => {
  const result = await runCommand("deno", [
    "run",
    "--allow-run",
    "safe-find.ts",
    ".",
    "-exec",
    "echo",
    "test",
    ";",
  ]);

  assertEquals(
    result.success,
    false,
    "safe-find should fail when -exec is used",
  );
  assert(
    result.stderr.includes("Dangerous option") &&
      result.stderr.includes("-exec"),
    "Error message should mention dangerous -exec option",
  );
});

Deno.test("safe-find integration - blocks -delete option", async () => {
  const result = await runCommand("deno", [
    "run",
    "--allow-run",
    "safe-find.ts",
    ".",
    "-name",
    "*.tmp",
    "-delete",
  ]);

  assertEquals(
    result.success,
    false,
    "safe-find should fail when -delete is used",
  );
  assert(
    result.stderr.includes("Dangerous option") &&
      result.stderr.includes("-delete"),
    "Error message should mention dangerous -delete option",
  );
});

Deno.test("safe-fd integration - executes with safe options", async () => {
  const result = await runCommand("deno", [
    "run",
    "--allow-run",
    "safe-fd.ts",
    "--glob",
    "*.ts",
  ]);

  assert(
    result.success,
    "safe-fd should execute successfully with safe options",
  );
  assert(result.output.length > 0, "safe-fd should find TypeScript files");
});

Deno.test("safe-fd integration - blocks -x option", async () => {
  const result = await runCommand("deno", [
    "run",
    "--allow-run",
    "safe-fd.ts",
    "--glob",
    "*.ts",
    "-x",
    "echo",
  ]);

  assertEquals(result.success, false, "safe-fd should fail when -x is used");
  assert(
    result.stderr.includes("Dangerous option") && result.stderr.includes("-x"),
    "Error message should mention dangerous -x option",
  );
});

Deno.test("safe-fd integration - blocks --list-details option", async () => {
  const result = await runCommand("deno", [
    "run",
    "--allow-run",
    "safe-fd.ts",
    "--glob",
    "*.ts",
    "--list-details",
  ]);

  assertEquals(
    result.success,
    false,
    "safe-fd should fail when --list-details is used",
  );
  assert(
    result.stderr.includes("Dangerous option") &&
      result.stderr.includes("--list-details"),
    "Error message should mention dangerous --list-details option",
  );
});
