const state = {
    semesters: [
        {
            id: 1,
            courses: [
                { id: 11, name: "MTH 101", units: 4, grade: 5 },
                { id: 12, name: "CHM 101", units: 3, grade: 4 },
                { id: 13, name: "PHY 101", units: 4, grade: 3 },
                { id: 14, name: "GST 101", units: 2, grade: 5 }
            ]
        },
        {
            id: 2,
            courses: [
                { id: 21, name: "MTH 102", units: 4, grade: 5 },
                { id: 22, name: "CHM 102", units: 3, grade: 5 },
                { id: 23, name: "PHY 102", units: 4, grade: 4 },
                { id: 24, name: "GST 102", units: 2, grade: 4 }
            ]
        }
    ]
};

// Generates unique IDs
let nextId = 100;

// DOM Elements
const semestersContainer = document.getElementById('semesters-container');
const btnAddSemester = document.getElementById('btn-add-semester');
const cgpaValue = document.getElementById('cgpa-value');
const cgpaLarge = document.getElementById('cgpa-large');
const totalUnitsEl = document.getElementById('total-units');
const classificationEl = document.getElementById('classification');
const needleGroup = document.getElementById('needle-group');
const semesterTemplate = document.getElementById('semester-template');
const courseTemplate = document.getElementById('course-template');

// Initialize
function init() {
    render();
    
    btnAddSemester.addEventListener('click', () => {
        state.semesters.push({
            id: nextId++,
            courses: [
                { id: nextId++, name: "", units: 1, grade: 5 }
            ]
        });
        render();
    });
}

// Calculate GPA and update Stats
function updateStats() {
    let totalPoints = 0;
    let totalUnits = 0;

    state.semesters.forEach(semester => {
        let semPoints = 0;
        let semUnits = 0;
        
        semester.courses.forEach(course => {
            semPoints += (course.units * course.grade);
            semUnits += course.units;
        });
        
        semester.gpa = semUnits > 0 ? (semPoints / semUnits) : 0;
        
        totalPoints += semPoints;
        totalUnits += semUnits;
    });

    const cgpa = totalUnits > 0 ? (totalPoints / totalUnits) : 0;
    const cgpaFormatted = cgpa.toFixed(2);
    
    // Update DOM
    cgpaValue.textContent = cgpaFormatted;
    cgpaLarge.textContent = cgpaFormatted;
    totalUnitsEl.textContent = totalUnits;
    
    // Classification
    let classification = "N/A";
    let classificationColor = "#64748b"; // default
    if (totalUnits > 0) {
        if (cgpa >= 4.50) {
            classification = "First Class";
            classificationColor = "#37c759";
        } else if (cgpa >= 3.50) {
            classification = "Second Class Upper (2:1)";
            classificationColor = "#3b82f6";
        } else if (cgpa >= 2.40) {
            classification = "Second Class Lower (2:2)";
            classificationColor = "#33c1d9";
        } else if (cgpa >= 1.50) {
            classification = "Third Class";
            classificationColor = "#f6a935";
        } else if (cgpa >= 1.00) {
            classification = "Pass";
            classificationColor = "#e8615c";
        } else {
            classification = "Fail";
            classificationColor = "#e8615c";
        }
    }
    
    classificationEl.textContent = classification;
    classificationEl.style.color = classificationColor;

    // Animate Needle
    // 0 -> 0 degrees, 5 -> 180 degrees
    const angle = (cgpa / 5.0) * 180;
    // Add a slight delay for visual flair on initial load
    setTimeout(() => {
        needleGroup.style.transformOrigin = '100px 100px';
        needleGroup.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        needleGroup.style.transform = `rotate(${angle}deg)`;
    }, 50);
}

// Render the UI based on state
function render() {
    updateStats();
    semestersContainer.innerHTML = '';
    
    state.semesters.forEach((semester, index) => {
        const semNode = semesterTemplate.content.cloneNode(true);
        const semCard = semNode.querySelector('.semester-card');
        semCard.dataset.semesterId = semester.id;
        
        semNode.querySelector('.semester-number').textContent = index + 1;
        semNode.querySelector('.semester-gpa').textContent = semester.gpa.toFixed(2);
        
        // Remove Semester Listener
        semNode.querySelector('.btn-remove-semester').addEventListener('click', () => {
            state.semesters = state.semesters.filter(s => s.id !== semester.id);
            render();
        });
        
        // Add Course Listener
        semNode.querySelector('.btn-add-course').addEventListener('click', () => {
            semester.courses.push({ id: nextId++, name: "", units: 1, grade: 5 });
            render();
        });
        
        const coursesList = semNode.querySelector('.courses-list');
        
        semester.courses.forEach(course => {
            const courseNode = courseTemplate.content.cloneNode(true);
            const courseRow = courseNode.querySelector('.course-row');
            courseRow.dataset.courseId = course.id;
            
            const nameInput = courseNode.querySelector('.course-name-input');
            const unitsSelect = courseNode.querySelector('.units-select');
            const gradeSelect = courseNode.querySelector('.grade-select');
            
            nameInput.value = course.name;
            unitsSelect.value = course.units;
            gradeSelect.value = course.grade;
            
            // Listeners
            nameInput.addEventListener('input', (e) => {
                course.name = e.target.value;
            });
            
            unitsSelect.addEventListener('change', (e) => {
                course.units = parseInt(e.target.value, 10);
                updateStats(); // Update stats immediately without full re-render
                semCard.querySelector('.semester-gpa').textContent = semester.gpa.toFixed(2);
            });
            
            gradeSelect.addEventListener('change', (e) => {
                course.grade = parseInt(e.target.value, 10);
                updateStats();
                semCard.querySelector('.semester-gpa').textContent = semester.gpa.toFixed(2);
            });
            
            courseNode.querySelector('.btn-remove-course').addEventListener('click', () => {
                semester.courses = semester.courses.filter(c => c.id !== course.id);
                render();
            });
            
            coursesList.appendChild(courseNode);
        });
        
        semestersContainer.appendChild(semNode);
    });
}

// Start
document.addEventListener('DOMContentLoaded', init);
