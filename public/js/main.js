// 全局函数：格式化时间
function formatDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

// 全局函数：显示提示消息
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
    
    // 3秒后自动消失
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// 表单验证
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
});

// 代码编辑器主题切换
function changeEditorTheme(theme) {
    if (typeof editor !== 'undefined') {
        editor.setOption('theme', theme);
    }
}

// 自动保存代码到localStorage
function autoSaveCode() {
    if (typeof editor !== 'undefined') {
        const problemId = document.querySelector('[data-problem-id]')?.dataset.problemId;
        if (problemId) {
            localStorage.setItem(`code_${problemId}`, editor.getValue());
        }
    }
}

// 加载保存的代码
function loadSavedCode() {
    if (typeof editor !== 'undefined') {
        const problemId = document.querySelector('[data-problem-id]')?.dataset.problemId;
        if (problemId) {
            const savedCode = localStorage.getItem(`code_${problemId}`);
            if (savedCode) {
                editor.setValue(savedCode);
            }
        }
    }
}

// 定期自动保存
setInterval(autoSaveCode, 30000);

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载保存的代码
    loadSavedCode();
    
    // 初始化工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
