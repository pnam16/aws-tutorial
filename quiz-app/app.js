/**
 * AWS Quiz Application
 * Main application logic for quiz functionality
 */

class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answeredQuestions = new Set();
        this.userAnswers = {};
        
        this.init();
    }
    
    async init() {
        this.showLoading(true);
        
        // Load questions
        try {
            this.questions = await QuestionParser.loadAllQuestions();
            console.log(`Loaded ${this.questions.length} questions`);
            
            // Load saved progress from localStorage
            this.loadProgress();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Display first question
            this.displayQuestion();
            
            // Update UI
            this.updateProgressInfo();
            
        } catch (error) {
            console.error('Error initializing quiz:', error);
            alert('Không thể tải câu hỏi. Vui lòng kiểm tra lại đường dẫn file.');
        } finally {
            this.showLoading(false);
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        
        // Action buttons
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('filterBtn').addEventListener('click', () => this.showFilterModal());
        
        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.hideFilterModal());
        
        // Click outside modal to close
        document.getElementById('filterModal').addEventListener('click', (e) => {
            if (e.target.id === 'filterModal') {
                this.hideFilterModal();
            }
        });
    }
    
    displayQuestion() {
        if (this.questions.length === 0) return;
        
        const question = this.questions[this.currentQuestionIndex];
        
        // Update question number and text
        document.getElementById('questionNumber').textContent = `Câu ${question.number}`;
        document.getElementById('questionText').textContent = question.questionText;
        
        // Check if this question was already answered
        const isAnswered = this.answeredQuestions.has(question.number);
        const userAnswer = this.userAnswers[question.number];
        
        // Display options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.dataset.answer = option.label;
            
            if (isAnswered) {
                optionDiv.classList.add('disabled');
                
                // Highlight correct and incorrect answers
                if (option.label === question.correctAnswer) {
                    optionDiv.classList.add('correct');
                }
                if (userAnswer === option.label && userAnswer !== question.correctAnswer) {
                    optionDiv.classList.add('incorrect');
                }
            }
            
            optionDiv.innerHTML = `
                <span class="option-label">${option.label}.</span>
                <span class="option-text">${option.text}</span>
            `;
            
            // Add click handler if not answered
            if (!isAnswered) {
                optionDiv.addEventListener('click', () => this.selectAnswer(option.label));
            }
            
            optionsContainer.appendChild(optionDiv);
        });
        
        // Show/hide explanation
        const explanationPanel = document.getElementById('explanationPanel');
        if (isAnswered) {
            this.showExplanation(question);
        } else {
            explanationPanel.classList.add('hidden');
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Update progress
        this.updateProgressInfo();
    }
    
    selectAnswer(answer) {
        const question = this.questions[this.currentQuestionIndex];
        
        // Mark as answered
        this.answeredQuestions.add(question.number);
        this.userAnswers[question.number] = answer;
        
        // Update score
        if (answer === question.correctAnswer) {
            this.score++;
        }
        
        // Disable all options and highlight correct/incorrect
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.add('disabled');
            const optionAnswer = option.dataset.answer;
            
            if (optionAnswer === question.correctAnswer) {
                option.classList.add('correct');
            }
            if (optionAnswer === answer && answer !== question.correctAnswer) {
                option.classList.add('incorrect');
            }
        });
        
        // Show explanation
        this.showExplanation(question);
        
        // Update UI
        this.updateProgressInfo();
        
        // Save progress
        this.saveProgress();
    }
    
    showExplanation(question) {
        const explanationPanel = document.getElementById('explanationPanel');
        const explanationContent = document.getElementById('explanationContent');
        
        // Format and display explanation
        explanationContent.innerHTML = QuestionParser.formatExplanation(question.explanation);
        
        explanationPanel.classList.remove('hidden');
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
    }
    
    updateProgressInfo() {
        // Update score
        document.getElementById('score').textContent = this.score;
        document.getElementById('totalQuestions').textContent = this.questions.length;
        
        // Update question counter
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestionsCounter').textContent = this.questions.length;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }
    
    restart() {
        if (confirm('Bạn có chắc muốn làm lại từ đầu? Tiến độ hiện tại sẽ bị xóa.')) {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.answeredQuestions.clear();
            this.userAnswers = {};
            
            // Clear localStorage
            localStorage.removeItem('quizProgress');
            
            // Redisplay
            this.displayQuestion();
        }
    }
    
    showFilterModal() {
        const modal = document.getElementById('filterModal');
        const filterOptions = document.getElementById('filterOptions');
        
        // Generate filter options based on question files
        const ranges = [
            { label: 'Tất cả câu hỏi', start: 1, end: this.questions.length },
            { label: 'Câu 1-50', start: 1, end: 50 },
            { label: 'Câu 51-100', start: 51, end: 100 },
            { label: 'Câu 101-150', start: 101, end: 150 },
            { label: 'Câu 151-200', start: 151, end: 200 },
            { label: 'Câu 201-250', start: 201, end: 250 },
            { label: 'Câu 251-300', start: 251, end: 300 },
            { label: 'Câu 301-350', start: 301, end: 350 },
            { label: 'Câu 351-400', start: 351, end: 400 },
            { label: 'Câu 401-450', start: 401, end: 450 },
            { label: 'Câu 451-500', start: 451, end: 500 },
            { label: 'Câu 501-550', start: 501, end: 550 },
            { label: 'Câu 551-600', start: 551, end: 600 },
            { label: 'Câu 601-684', start: 601, end: 684 }
        ];
        
        filterOptions.innerHTML = '';
        ranges.forEach(range => {
            const option = document.createElement('div');
            option.className = 'filter-option';
            option.textContent = range.label;
            option.addEventListener('click', () => {
                this.filterQuestions(range.start, range.end);
                this.hideFilterModal();
            });
            filterOptions.appendChild(option);
        });
        
        modal.classList.remove('hidden');
    }
    
    hideFilterModal() {
        document.getElementById('filterModal').classList.add('hidden');
    }
    
    filterQuestions(start, end) {
        // Find the first question in the range
        const index = this.questions.findIndex(q => q.number >= start && q.number <= end);
        if (index !== -1) {
            this.currentQuestionIndex = index;
            this.displayQuestion();
        }
    }
    
    saveProgress() {
        const progress = {
            currentQuestionIndex: this.currentQuestionIndex,
            score: this.score,
            answeredQuestions: Array.from(this.answeredQuestions),
            userAnswers: this.userAnswers
        };
        
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('quizProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.currentQuestionIndex = progress.currentQuestionIndex || 0;
                this.score = progress.score || 0;
                this.answeredQuestions = new Set(progress.answeredQuestions || []);
                this.userAnswers = progress.userAnswers || {};
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        }
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
