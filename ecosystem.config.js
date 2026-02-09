export default {
    apps: [
        {
            name: "frontend-skripsi",
            script: "npm",
            args: "run dev -- --host",
            interpreter: "none",
            env: {
                NODE_ENV: "development",
            },
        },
    ],
};
