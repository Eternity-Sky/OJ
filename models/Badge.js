let badges = []; // 存储所有徽章

function addBadge(userId, badgeName) {
    const badge = { userId, badgeName };
    badges.push(badge);
}

function getUserBadges(userId) {
    return badges.filter(badge => badge.userId === userId);
}

module.exports = { addBadge, getUserBadges }; 