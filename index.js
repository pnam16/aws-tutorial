import fs from "fs";

// Config
const PICK_COUNT = 1;
const MAX_LINE_LENGTH = 80;

// Helper: Wrap text to max length without breaking words
const wrapText = (str, limit) => {
  return str
    .split("\n")
    .map((line) => {
      if (line.length <= limit) return line;

      const words = line.split(" ");
      let currentLine = "";
      const lines = [];

      words.forEach((word) => {
        if ((currentLine + word).length <= limit) {
          currentLine += (currentLine === "" ? "" : " ") + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });
      lines.push(currentLine);
      return lines.join("\n");
    })
    .join("\n");
};

// Read file
const text = fs.readFileSync("SAA-C03-Question.txt", "utf-8");
const questions = text.split("\n\n").slice(1);

// Generate unique random indices
const indices = new Set();
while (indices.size < PICK_COUNT) {
  indices.add(Math.floor(Math.random() * questions.length));
}

const selected = Array.from(indices).sort((a, b) => a - b);

const questionNums = [];
const result = selected
  .map((i) => {
    const q = questions[i];
    const match = q.match(/#(\d+)/);
    const num = match ? match[1] : "unknown";

    questionNums.push(num);
    return wrapText(q, MAX_LINE_LENGTH); // Áp dụng wrap cho câu hỏi
  })
  .join("\n\n");

const promptText =
  "If I can't answer or give a wrong answer, please give me the correct answer and explain it.";

const output = [
  promptText
  result,
  questionNums.join(":\n") + ":",
];

if (!fs.existsSync("dist")) fs.mkdirSync("dist");
fs.writeFileSync("dist/result.txt", output.join("\n\n"));
