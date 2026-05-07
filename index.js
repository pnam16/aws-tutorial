import fs from "fs"


// read file
const text = fs.readFileSync("SAA-C03-Question.txt", "utf-8")


const questions = text.split("\nQuestion")

// console.log("text", text)
console.log("questions 0", questions[0])
console.log("questions 1", questions[1])
console.log("questions 2", questions[2])
console.log("questions 3", questions[3])
