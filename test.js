const students = [
    { name: "Alex",   capacity: 15 },
    { name: "Devlin", capacity: 15 },
    { name: "Eagle",  capacity: 13 },
    { name: "Sam",    capacity: 14 }
];

students.sort((firstItem, secondItem) => firstItem.capacity - secondItem.capacity);

