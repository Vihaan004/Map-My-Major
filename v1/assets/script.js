document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('.map');
    const addSemesterButton = document.getElementById('new-semester');
    const modal = document.getElementById('classModal');
    const span = document.getElementsByClassName('close')[0];
    const classForm = document.getElementById('classForm');

    let currentSemester = null;

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

        const semLabelContainer = document.createElement('div');
        semLabelContainer.classList.add('sem-label-container');
        
        const semLabel = document.createElement('h2');
        semLabel.classList.add('sem-label');
        semLabel.textContent = `Sem ${semesterNumber}`;
        
        const deleteSemesterButton = document.createElement('img');
        deleteSemesterButton.classList.add('delete-semester');
        deleteSemesterButton.src = 'assets/images/delete.png';
        deleteSemesterButton.alt = 'delete';
        deleteSemesterButton.addEventListener('click', () => {
            removeSemester(semester);
        });

        semLabelContainer.appendChild(semLabel);
        semLabelContainer.appendChild(deleteSemesterButton);

        const seasonName = document.createElement('h3');
        seasonName.classList.add('sem-name');
        seasonName.textContent = semesterNumber % 2 === 0 ? `Spring ${24 + Math.floor(semesterNumber / 2)}` : `Fall ${24 + Math.floor(semesterNumber / 2)}`;

        semesterHead.appendChild(semLabelContainer);
        semesterHead.appendChild(seasonName);
        semester.appendChild(semesterHead);

        const addClassButton = document.createElement('div');
        addClassButton.classList.add('add-class-button');
        addClassButton.textContent = '+';
        addClassButton.addEventListener('click', () => {
            currentSemester = semester;
            modal.style.display = 'block';
        });

        semester.appendChild(addClassButton);

        const semesterFooter = document.createElement('div');
        semesterFooter.classList.add('semester-footer');

        const footerBox = document.createElement('div');
        footerBox.classList.add('footer-box');



        // const semTotal = document.createElement('div');
        // semTotal.classList.add('sem-total');

        // Add the credit hours sum display
        const creditHoursSum = document.createElement('div');
        creditHoursSum.classList.add('credit-hours-sum');
        creditHoursSum.textContent = '0';
        
        footerBox.appendChild(creditHoursSum);

        // required
        semesterFooter.appendChild(footerBox);

        semester.appendChild(semesterFooter);

        map.insertBefore(semester, addSemesterButton);
    }

    classForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const className = document.getElementById('className').value;
        const requirements = document.getElementById('requirements').value;
        const creditHours = document.getElementById('creditHours').value;

        if (currentSemester && className && creditHours <= 99) {
            addClassBox(currentSemester, { className, requirements, creditHours });
            modal.style.display = 'none';
            classForm.reset();
            currentSemester = null;
        }
    });

    span.onclick = function() {
        modal.style.display = 'none';
        classForm.reset();
        currentSemester = null;
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            classForm.reset();
            currentSemester = null;
        }
    }

    function addClassBox(semester, classDetails) {
        const classbox = document.createElement('div');
        classbox.classList.add('classbox');
        classbox.draggable = true;

        const classNameRow = document.createElement('div');
        classNameRow.classList.add('classbox-row', 'left-align');
        classNameRow.textContent = classDetails.className;

        const requirementsRow = document.createElement('div');
        requirementsRow.classList.add('classbox-row', 'left-align');
        requirementsRow.textContent = classDetails.requirements || ' ';

        const creditHoursRow = document.createElement('div');
        creditHoursRow.classList.add('classbox-row', 'right-align', 'credits');
        creditHoursRow.textContent = classDetails.creditHours;

        classbox.appendChild(classNameRow);
        classbox.appendChild(requirementsRow);
        classbox.appendChild(creditHoursRow);

        semester.insertBefore(classbox, semester.querySelector('.add-class-button'));

        updateCreditHoursSum(semester); // Update the credit hours sum
    }

    function updateCreditHoursSum(semester) {
        const classBoxes = semester.querySelectorAll('.classbox');
        let totalCreditHours = 0;
        classBoxes.forEach(classBox => {
            // totalCreditHours += parseInt(classBox.dataset.creditHours, 10);
            totalCreditHours += parseInt(classBox.querySelector('.credits').textContent, 10);
        });
        const creditHoursSum = semester.querySelector('.credit-hours-sum');
        creditHoursSum.textContent = totalCreditHours;

    }

    function removeSemester(semester) {
        semester.remove();
        adjustSemesterNumbers();
    }

    function adjustSemesterNumbers() {
        const semesters = document.querySelectorAll('.semester');
        semesters.forEach((semester, index) => {
            const semLabel = semester.querySelector('.sem-label');
            semLabel.textContent = `Sem ${index + 1}`;
            const seasonLabel = semester.querySelector('.semester-head h3');
            seasonLabel.textContent = (index + 1) % 2 === 0 ? `Spring ${24 + Math.floor((index + 1) / 2)}` : `Fall ${24 + Math.floor((index + 1) / 2)}`;
        });
    }
});
