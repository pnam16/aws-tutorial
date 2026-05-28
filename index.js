import fs from "fs";

// Config
const PICK_COUNT = 5;
const MAX_LINE_LENGTH = 80;

// Wrap text to max line length
const wrapText = (text, maxLength) => {
  return text
    .split("\n")
    .map((line) => {
      const words = line.split(" ");
      const wrapped = [];
      let current = "";

      for (const word of words) {
        if ((current + word).length + 1 > maxLength) {
          wrapped.push(current.trim());
          current = word + " ";
        } else {
          current += word + " ";
        }
      }

      if (current.trim()) {
        wrapped.push(current.trim());
      }

      return wrapped.join("\n");
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
    return q;
  })
  .join("\n\n");

const outputRaw = [
  "If I can't answer or give a wrong answer, please give me the correct answer and explain it.",
  result,
  questionNums.join(":\n") + ":",
].join("\n\n");

// Apply wrap
const output = wrapText(outputRaw, MAX_LINE_LENGTH);

fs.writeFileSync("dist/result.txt", output);
