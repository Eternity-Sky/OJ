document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/problems')
        .then(response => response.json())
        .then(data => {
            const problemList = document.getElementById('problem-list');
            data.forEach(problem => {
                const li = document.createElement('li');
                li.textContent = problem.title;
                problemList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching problems:', error));
}); 