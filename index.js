import fs from "fs";

// read file
const text = fs.readFileSync("SAA-C03-Question.txt", "utf-8");

let questions = text.split("\n\n");

questions.splice(0, 1);

const indexs = [];
while (indexs.length < 5) {
  const random = Math.floor(Math.random() * questions.length) + 0;

  if (!indexs.includes(random)) {
    indexs.push(random);
  }
}

let result = indexs
  .sort()
  .map((i) => questions[i])
  .join("\n\n");

result += "\n\n" + indexs.join(":\n") + ":";

fs.writeFileSync("dist/result", result);
