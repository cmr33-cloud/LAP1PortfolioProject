const entries = require('../entries.json');

class Entries {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.body = data.body
        this.image = data.image;
        this.time = data.time;
        this.tags = data.tags;
        this.date = Date();
        this.emojis = [0,0,0]
        this.comments = []
    }
    
    static createEntry(data){
        const newID = entries.length + 1;
        const newEntry = new Entries(
            { id: newID, ...data
            }
            );
        entries.push(newEntry);
        return newEntry;
    }
}

module.exports = Entries;