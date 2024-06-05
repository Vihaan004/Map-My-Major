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
            adjustHeight();
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

        // for (let j = 0; j < 6; j++) {
        //     const classbox = document.createElement('div');
        //     classbox.classList.add('classbox');
        //     semester.appendChild(classbox);
        // }

        const addClassButton = document.createElement('div');
        addClassButton.classList.add('add-class-button');
        addClassButton.textContent = '+';
        addClassButton.addEventListener('click', () => {
            addClassBox(semester);
            adjustHeight();
        });

        semester.appendChild(addClassButton);

        map.insertBefore(semester, addSemesterButton);
    }

    function addClassBox(semester) {
        const classbox = document.createElement('div');
        classbox.classList.add('classbox');
        semester.insertBefore(classbox, semester.querySelector('.add-class-button'));
    }

    // function adjustHeight() {
    //     const semesters = document.querySelectorAll('.semester');
    //     let maxHeight = 0;

    //     semesters.forEach(semester => {
    //         const height = semester.offsetHeight;
    //         if (height > maxHeight) {
    //             maxHeight = height;
    //         }
    //     });

    //     semesters.forEach(semester => {
    //         semester.style.height = `${maxHeight}px`;
    //     });

    //     const newSemester = document.getElementById('new-semester');
    //     newSemester.style.height = `${maxHeight}px`;
    // }

    // adjustHeight();
});
