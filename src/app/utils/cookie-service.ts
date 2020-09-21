import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CookieSevice {

    private PATH = '/';

    constructor() {
    }

    get(name: string): any {
        let obj;
        document
            .cookie
            .split(';')
            .forEach(ck => {
                const [key, value] = ck.split('=');
                if (key.trim() === name) {
                    obj = value;
                }
            })
        return obj;
    }

    set(key: string, value: any): boolean {
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        try {
            document.cookie = `${key}=${JSON.stringify(value)};path=${this.PATH};expires=${expires.toUTCString()};`;
            return true;
        } catch (e) {
            return false;
        }
    }

    clear(key: string): void {
        document.cookie = `${key}=; expires=Thu, 01-Jan-1970 00:00:01 GMT;`;
    }
}
