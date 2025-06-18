import { assertThrows } from "@std/assert";
import { checkDangerousOptions } from "./safe-fd.ts";

Deno.test("checkDangerousOptions - throws on -x option", () => {
  const input = ["pattern", "-x", "echo hello", "directory"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-x' is not allowed for security reasons",
  );
});

Deno.test("checkDangerousOptions - throws on --exec option", () => {
  const input = ["pattern", "--exec", "echo test", "directory"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '--exec' is not allowed for security reasons",
  );
});

Deno.test("checkDangerousOptions - throws on -X option", () => {
  const input = ["pattern", "-X", "ls -la", "directory"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-X' is not allowed for security reasons",
  );
});

Deno.test("checkDangerousOptions - throws on --exec-batch option", () => {
  const input = ["pattern", "--exec-batch", "cat {}", "directory"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '--exec-batch' is not allowed for security reasons",
  );
});

Deno.test("checkDangerousOptions - throws on combined -x option", () => {
  const input = ["pattern", "-xecho hello", "directory"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-x' is not allowed for security reasons",
  );
});

Deno.test("checkDangerousOptions - throws on --exec= option", () => {
  const input = ["pattern", "--exec=echo test", "directory"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '--exec' is not allowed for security reasons",
  );
});

Deno.test("checkDangerousOptions - allows safe options", () => {
  const input = ["pattern", "-t", "f", "-e", "txt", "directory"];
  // Should not throw
  checkDangerousOptions(input);
});

Deno.test("checkDangerousOptions - handles empty input", () => {
  const input: string[] = [];
  // Should not throw
  checkDangerousOptions(input);
});

Deno.test("checkDangerousOptions - throws on -l option", () => {
  const input = ["pattern", "-l", "directory"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-l' is not allowed for security reasons",
  );
});

Deno.test("checkDangerousOptions - throws on --list-details option", () => {
  const input = ["pattern", "--list-details", "directory"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '--list-details' is not allowed for security reasons",
  );
});

Deno.test("checkDangerousOptions - throws on first dangerous option found", () => {
  const input = [
    "pattern",
    "-x",
    "echo hello",
    "--exec",
    "echo world",
    "-t",
    "f",
  ];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-x' is not allowed for security reasons",
  );
});
