// auth.js - Shared authentication logic for NTPC OpenID
(function() {
    const sessionKey = 'ntpc_toolhub_session';
    const authorizedUser = 'taksito';
    const loginPage = 'login.html';

    // Simple session check
    const session = JSON.parse(localStorage.getItem(sessionKey));
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage !== loginPage && currentPage !== 'callback.html') {
        if (!session || session.username !== authorizedUser || (Date.now() - session.timestamp > 86400000)) {
            // No valid session or expired (24h), redirect to login
            console.log('Unauthorized access or session expired. Redirecting to login.');
            window.location.href = loginPage;
        }
    }

    // Export logout function to global scope
    window.logout = function() {
        localStorage.removeItem(sessionKey);
        window.location.href = loginPage;
    };
})();
