export class User {
    static USER = 'user';

    constructor(id?: string, name?: string, image?: string, sex?: 'f' | 'm') {
        this.id = id || this.id;
        this.name = name || this.name;
        this.image = image || this.image;
        this.sex = sex || this.sex;
    }

    id: string;
    name: string;
    image = '';
    sex: 'f' | 'm' = 'm';
}