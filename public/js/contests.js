document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/contests')
        .then(response => response.json())
        .then(data => {
            const contestList = document.getElementById('contest-list');
            data.forEach(contest => {
                const li = document.createElement('li');
                li.textContent = contest.title;
                contestList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching contests:', error));
}); 