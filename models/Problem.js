let problems = [];

function addProblem(title, description, input, output) {
    const problem = { title, description, input, output };
    problems.push(problem);
}

function getProblems() {
    return problems;
}

module.exports = { addProblem, getProblems }; 