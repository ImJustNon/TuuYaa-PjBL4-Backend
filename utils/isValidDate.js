module.exports = {
    isValidDate: (dateObj) =>{
        let isValid = null
        try {
            const { day, month, year, hour, minute, ampm } = dateObj;
            // Convert 12-hour time to 24-hour time
            let hours = hour;
            if (ampm.toUpperCase() === 'PM' && hour !== 12) {
                hours += 12;
            } else if (ampm.toUpperCase() === 'AM' && hour === 12) {
                hours = 0;
            }
            // Create a Date object
            const date = new Date(year, month - 1, day, hours, minute);
            // Check if the date is valid
            isValid = date.getFullYear() === year &&
                            date.getMonth() === month - 1 &&
                            date.getDate() === day &&
                            date.getHours() === hours &&
                            date.getMinutes() === minute;
            return [isValid, null];
        }
        catch(e){
            return [isValid, `${e}`];
        }
    }
}