import fs from "fs";

// Config
const PICK_COUNT = 3;

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

const finalOutput =
  "If I can’t answer or give a wrong answer, please give me the correct answer and explain it.\n" +
  result +
  "\n\n" +
  questionNums.join(":\n") +
  ":";

fs.writeFileSync("dist/result.txt", finalOutput);
