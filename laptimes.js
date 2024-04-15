window.onload = async function() {
    try {
        // Fetch the latest_log.txt file from the same directory
        const response = await fetch('latest_log.txt');
        if (!response.ok) {
            throw new Error('Failed to fetch log file');
        }
        const contents = await response.text();

        // Parse log entries
        let logLines = contents.split('\n');
        let lapData = {}; // Object to store lap data for each username

        // Iterate through log lines
        logLines.forEach(line => {
            let match = line.match(/Lap completed by (.+), (\d+) cuts, laptime (\d+)/);
            if (match) {
                let username = match[1];
                let cuts = parseInt(match[2]);
                let laptime = parseInt(match[3]);
                let lapDescription = 'Lap completed';

                // Only process if cuts are equal to 0
                if (cuts === 0) {
                    // If username exists in lapData, compare laptime and update if necessary
                    if (lapData.hasOwnProperty(username)) {
                        if (laptime < lapData[username].laptime) {
                            lapData[username] = { laptime: laptime, description: lapDescription };
                        }
                    } else {
                        lapData[username] = { laptime: laptime, description: lapDescription };
                    }
                }
            }
        });

        // Add formatted lap data to the list
        let logList = document.getElementById('logList');
        for (let username in lapData) {
            if (lapData.hasOwnProperty(username)) {
                let laptime = lapData[username].laptime;
                let minutes = Math.floor(laptime / 60000);
                let seconds = Math.floor((laptime % 60000) / 1000);
                let milliseconds = laptime % 1000;
                let formattedTime = `${minutes} min, ${seconds} sec, ${milliseconds} ms`;
                let listItem = document.createElement('li');
                listItem.textContent = `${username}: ${formattedTime} `;
                logList.appendChild(listItem);
            }
        }
    } catch (error) {
        console.error('Error accessing file:', error);
    }
};