const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function killPort(port) {
    try {
        // Find PID on the given port
        const output = execSync(`netstat -ano | findstr :${port}`).toString();
        const lines = output.trim().split('\n');
        const pids = new Set();

        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 5) {
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0' && !isNaN(pid)) {
                    pids.add(pid);
                }
            }
        });

        if (pids.size > 0) {
            console.log(`Found process(es) on port ${port}: ${Array.from(pids).join(', ')}`);
            pids.forEach(pid => {
                try {
                    execSync(`taskkill /F /PID ${pid}`);
                    console.log(`Successfully killed process ${pid}`);
                } catch (e) {
                    console.log(`Failed to kill process ${pid} (it might already be closed)`);
                }
            });
        } else {
            console.log(`No processes found on port ${port}.`);
        }
    } catch (error) {
        // Usually means no process found
        console.log(`Port ${port} is clear.`);
    }

    // Also try to clean up the lock file
    try {
        const lockFile = path.join(process.cwd(), '.next', 'dev', 'lock');
        if (fs.existsSync(lockFile)) {
            console.log('Found Next.js lock file, removing...');
            fs.unlinkSync(lockFile);
            console.log('Successfully removed lock file.');
        }
    } catch (error) {
        console.log('No lock file to remove or failed to remove it.');
    }
}

// Kill port 3000 (default Next.js port)
killPort(3000);
