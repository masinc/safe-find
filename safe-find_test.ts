import { assertThrows } from "@std/assert";
import { checkDangerousOptions } from "./safe-find.ts";

Deno.test("checkDangerousOptions - throws on -exec option", () => {
  const input = [".", "-name", "*.txt", "-exec", "echo", "{}", ";"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-exec' is not allowed for security reasons"
  );
});

Deno.test("checkDangerousOptions - throws on -execdir option", () => {
  const input = [".", "-name", "*.txt", "-execdir", "cat", "{}", ";"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-execdir' is not allowed for security reasons"
  );
});

Deno.test("checkDangerousOptions - throws on -ok option", () => {
  const input = [".", "-name", "*.txt", "-ok", "ls", "-l", "{}", ";"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-ok' is not allowed for security reasons"
  );
});

Deno.test("checkDangerousOptions - throws on -okdir option", () => {
  const input = [".", "-name", "*.txt", "-okdir", "echo", "{}", ";"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-okdir' is not allowed for security reasons"
  );
});

Deno.test("checkDangerousOptions - throws on -delete option", () => {
  const input = [".", "-name", "*.tmp", "-delete"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-delete' is not allowed for security reasons"
  );
});

Deno.test("checkDangerousOptions - allows safe options", () => {
  const input = [".", "-name", "*.txt", "-type", "f", "-size", "+1M"];
  // Should not throw
  checkDangerousOptions(input);
});

Deno.test("checkDangerousOptions - handles empty input", () => {
  const input: string[] = [];
  // Should not throw
  checkDangerousOptions(input);
});

Deno.test("checkDangerousOptions - allows basic find commands", () => {
  const input = [".", "-name", "*.ts", "-type", "f"];
  // Should not throw
  checkDangerousOptions(input);
});

Deno.test("checkDangerousOptions - allows complex safe find commands", () => {
  const input = [
    "/home", 
    "-name", "*.log", 
    "-type", "f", 
    "-size", "+10M", 
    "-mtime", "+7",
    "-print"
  ];
  // Should not throw
  checkDangerousOptions(input);
});

Deno.test("checkDangerousOptions - throws on first dangerous option found", () => {
  const input = [".", "-exec", "echo", "{}", ";", "-okdir", "cat", "{}", ";"];
  assertThrows(
    () => checkDangerousOptions(input),
    Error,
    "Dangerous option '-exec' is not allowed for security reasons"
  );
});

Deno.test("checkDangerousOptions - allows legitimate executable searches", () => {
  const input = [".", "-name", "*.sh", "-type", "f", "-executable"];
  // Should not throw (this is searching for executable files, not executing them)
  checkDangerousOptions(input);
});