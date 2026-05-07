import fs from "fs";

// read file
const text = fs.readFileSync("SAA-C03-Question.txt", "utf-8");

let questions = text.split("\n\n");

questions.splice(0, 1);

const reuslt = [];

Array(5).fill(null).forEach(() => {
  const random = Math.floor(Math.random() * reuslt.length) + 0
  console.log(random)
  reuslt.push(questions[random])
});

fs.writeFileSync("result", reuslt.join("\n\n"));
