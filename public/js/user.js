document.addEventListener('DOMContentLoaded', () => {
    const userId = /* 获取用户ID */;
    fetch(`/user/${userId}/badges`)
        .then(response => response.json())
        .then(data => {
            const badgeList = document.getElementById('badge-list');
            data.forEach(badge => {
                const li = document.createElement('li');
                li.textContent = badge.badgeName;
                badgeList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching badges:', error));
}); 