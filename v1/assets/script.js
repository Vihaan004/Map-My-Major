document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('.map');
    const addSemesterButton = document.getElementById('new-semester');

    // Initial semesters
    let initialSemesters = 8;
    for (let i = 1; i <= initialSemesters; i++) {
        addSemester(i);
    }

    // Add semester functionality
    addSemesterButton.addEventListener('click', () => {
        const currentSemesters = document.querySelectorAll('.semester').length;
        if (currentSemesters < 12) {
            addSemester(currentSemesters + 1);
        } else {
            alert('Maximum of 12 semesters reached.');
        }
    });

    function addSemester(semesterNumber) {
        const semester = document.createElement('div');
        semester.classList.add('semester');

        const semesterHead = document.createElement('div');
        semesterHead.classList.add('semester-head');
        
        const semLabel = document.createElement('h2');
        semLabel.classList.add('sem-label');
        semLabel.textContent = `Sem ${semesterNumber}`;

        const seasonLabel = document.createElement('h3');
        seasonLabel.classList.add('sem-label');
        seasonLabel.textContent = semesterNumber % 2 === 0 ? `Spring ${24 + Math.floor(semesterNumber / 2)}` : `Fall ${24 + Math.floor(semesterNumber / 2)}`;

        semesterHead.appendChild(semLabel);
        semesterHead.appendChild(seasonLabel);
        semester.appendChild(semesterHead);

        for (let j = 0; j < 6; j++) {
            const classbox = document.createElement('div');
            classbox.classList.add('classbox');
            semester.appendChild(classbox);
        }

        map.insertBefore(semester, addSemesterButton);
    }
});
