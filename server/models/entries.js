class Entries {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.image = data.image;
        this.time = data.time;
        this.tags = data.tags;
    }
    static getAll(){}
    static createEntry(){}
    static getById(){}
    static search(){}
}