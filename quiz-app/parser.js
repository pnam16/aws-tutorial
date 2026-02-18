/**
 * Markdown Parser for AWS Quiz Questions
 * Parses Vietnamese markdown files containing AWS certification questions
 */

class QuestionParser {
  /**
   * Parse a markdown file content and extract questions
   * @param {string} content - Raw markdown content
   * @returns {Array} Array of question objects
   */
  static parseMarkdown(content) {
    const questions = [];

    // Split by question markers (## Câu X)
    const questionBlocks = content.split(/##\s+Câu\s+(\d+)/);

    // Skip the first element (content before first question)
    for (let i = 1; i < questionBlocks.length; i += 2) {
      const questionNumber = parseInt(questionBlocks[i]);
      const questionContent = questionBlocks[i + 1];

      if (questionContent) {
        const question = this.parseQuestion(questionNumber, questionContent);
        if (question) {
          questions.push(question);
        }
      }
    }

    return questions;
  }

  /**
   * Parse individual question block
   * @param {number} number - Question number
   * @param {string} content - Question content
   * @returns {Object} Question object
   */
  static parseQuestion(number, content) {
    try {
      // Extract question text (Đề bài)
      const questionMatch = content.match(
        /\*\*Đề bài\*\*:\s*(.+?)(?=\n\n\*\*Các đáp án\*\*:)/s,
      );
      const questionText = questionMatch ? questionMatch[1].trim() : "";

      // Extract options (- A., - B., etc.)
      const optionsMatch = content.match(
        /\*\*Các đáp án\*\*:\s*\n\n((?:- [A-D]\..*?\n)+)/s,
      );
      const options = [];

      if (optionsMatch) {
        const optionLines = optionsMatch[1].match(/- ([A-D])\.\s*(.+)/g);
        if (optionLines) {
          optionLines.forEach((line) => {
            const match = line.match(/- ([A-D])\.\s*(.+)/);
            if (match) {
              options.push({
                label: match[1],
                text: match[2].trim(),
              });
            }
          });
        }
      }

      // Extract correct answer
      const answerMatch = content.match(
        /\*\*Đáp án đúng\*\*:\s*\*\*([A-D])\*\*/,
      );
      const correctAnswer = answerMatch ? answerMatch[1] : "";

      // Extract explanation
      const explanationMatch = content.match(
        /\*\*Giải thích chi tiết\*\*:\s*\n\n([\s\S]+?)(?=\n---|\n##|$)/,
      );
      let explanation = explanationMatch ? explanationMatch[1].trim() : "";

      // Clean up explanation - remove extra whitespace but preserve structure
      explanation = explanation.replace(/\n{3,}/g, "\n\n");

      return {
        number,
        questionText,
        options,
        correctAnswer,
        explanation,
      };
    } catch (error) {
      console.error(`Error parsing question ${number}:`, error);
      return null;
    }
  }

  /**
   * Load and parse a question file
   * @param {string} filePath - Path to markdown file
   * @returns {Promise<Array>} Promise resolving to array of questions
   */
  static async loadQuestionFile(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}`);
      }
      const content = await response.text();
      return this.parseMarkdown(content);
    } catch (error) {
      console.error(`Error loading question file ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Load all question files from the questions directory
   * @returns {Promise<Array>} Promise resolving to all questions
   */
  static async loadAllQuestions() {
    const questionFiles = [
      "questions/questions-001-050.md",
      "questions/questions-051-100.md",
      "questions/questions-101-150.md",
      "questions/questions-151-200.md",
      "questions/questions-201-250.md",
      "questions/questions-251-300.md",
      "questions/questions-301-350.md",
      "questions/questions-351-400.md",
      "questions/questions-401-450.md",
      "questions/questions-451-500.md",
      "questions/questions-501-550.md",
      "questions/questions-551-600.md",
      "questions/questions-601-650.md",
      "questions/questions-651-684.md",
    ];

    const allQuestions = [];

    for (const file of questionFiles) {
      const questions = await this.loadQuestionFile(file);
      allQuestions.push(...questions);
    }

    // Sort by question number
    allQuestions.sort((a, b) => a.number - b.number);

    return allQuestions;
  }

  /**
   * Format explanation text for HTML display
   * @param {string} explanation - Raw explanation text
   * @returns {string} HTML formatted explanation
   */
  static formatExplanation(explanation) {
    // Convert markdown-style formatting to HTML
    let html = explanation;

    // Convert bullet points
    html = html.replace(
      /^- \*\*([A-D]) - (SAI|ĐÚNG)\*\*:/gm,
      '<li><strong class="answer-$2">$1 - $2</strong>:',
    );

    // Convert bold text
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Convert line breaks to paragraphs
    const paragraphs = html.split("\n\n").filter((p) => p.trim());
    html = paragraphs
      .map((p) => {
        if (p.trim().startsWith("<li>")) {
          return p;
        }
        return `<p>${p.replace(/\n/g, "<br>")}</p>`;
      })
      .join("");

    // Wrap list items in ul
    html = html.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");

    return html;
  }
}

// Export for use in app.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = QuestionParser;
}
