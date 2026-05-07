import fs from "fs"


// read file
const text = fs.readFileSync("SAA-C03-Question.txt", "utf-8")


const questions = text.split("Question #")

// console.log("a", a)
console.log("questions", questions[0])
