const { isValidDate } = require("./utils/isValidDate");

const dateObj = {
    "day": 19,
    "month": 2,
    "year": 2024,
    "hour": 23,
    "minute": 0,
    "ampm": "AM"
};

console.log(isValidDate(dateObj))