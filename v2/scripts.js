let currentSemesterIndex = null;

function createSemester(index) {
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester';
    semesterDiv.id = `semester-${index}`;
    semesterDiv.innerHTML = `
        <div class="sem-header" onclick="toggleDropdown(${index})">
            <h4 class="sem-name" id="sem-name-${index}"> ${index + 1} - Sem ${index + 1}</h4>
        </div>
        <div class="add-class" onclick="openPopup(${index})">+</div>
    `;
    return semesterDiv;
}

function addSemester() {
    const map = document.getElementById('map');
    const semesterCount = map.children.length;
    const newSemester = createSemester(semesterCount);
    map.appendChild(newSemester);
}

function openPopup(semesterIndex) {
    currentSemesterIndex = semesterIndex;
    document.getElementById('classPopup').style.display = 'block';
}

function closePopup() {
    document.getElementById('classPopup').style.display = 'none';
}

function submitClass() {
    const className = document.getElementById('className').value;
    const classRequirements = document.getElementById('classRequirements').value;
    const classCredits = document.getElementById('classCredits').value;

    if (className && classRequirements && classCredits) {
        const semesterDiv = document.getElementById(`semester-${currentSemesterIndex}`);
        const classDiv = document.createElement('div');
        classDiv.className = 'class';
        classDiv.innerHTML = `
            <div class="class-name">${className}</div>
            <div class="class-requirements">${classRequirements}</div>
            <div class="class-credits">${classCredits}</div>
        `;
        semesterDiv.insertBefore(classDiv, semesterDiv.querySelector('.add-class'));
        closePopup();
    } else {
        alert('Please fill in all fields');
    }
}

function toggleDropdown(index) {
    const dropdown = document.getElementById(`dropdown-${index}`);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function renameSemester(index) {
    const semName = document.getElementById(`sem-name-${index}`);
    const newName = prompt('Enter new semester name:', semName.innerText);
    if (newName) {
        semName.innerText = newName;
    }
    toggleDropdown(index);
}

function deleteSemester(index) {
    const map = document.getElementById('map');
    const semesterToRemove = document.getElementById(`semester-${index}`);
    map.removeChild(semesterToRemove);

    // Update the IDs and numbers of remaining semesters
    const remainingSemesters = map.getElementsByClassName('semester');
    for (let i = 0; i < remainingSemesters.length; i++) {
        remainingSemesters[i].id = `semester-${i}`;
        remainingSemesters[i].querySelector('.sem-number').innerText = `${i + 1}`;
        remainingSemesters[i].querySelector('.header').setAttribute('onclick', `toggleDropdown(${i})`);
        remainingSemesters[i].querySelector('.dropdown').id = `dropdown-${i}`;
        remainingSemesters[i].querySelectorAll('.dropdown-content')[1].setAttribute('onclick', `deleteSemester(${i})`);
        remainingSemesters[i].querySelectorAll('.dropdown-content')[0].setAttribute('onclick', `renameSemester(${i})`);
        remainingSemesters[i].querySelector('.add-class').setAttribute('onclick', `openPopup(${i})`);
    }
}

// Initialize map with 8 semesters
for (let i = 0; i < 8; i++) {
    addSemester();
}

// Hide dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const dropdowns = document.getElementsByClassName('dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
        if (!dropdowns[i].parentElement.contains(event.target)) {
            dropdowns[i].style.display = 'none';
        }
    }
});
