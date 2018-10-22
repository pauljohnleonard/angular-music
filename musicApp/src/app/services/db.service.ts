import { Injectable } from '@angular/core';


@Injectable()
export abstract class DBService {

    user: any = null
    clients: Array<any> = []
    provider: any


    abstract register(cb: any): void ;

    abstract clean(): void;


    abstract signIn(): void;

    abstract signOut(): void;

    onAuthStateChanged(user: any) {
        // We ignore token refresh events.
    }

    abstract writeUserData(userId: any, name: any, email: any, imageUrl: any): void;

    /* Add a new item to the database at the path  containing the postData */
    abstract addItemAtPath(path: string, postData: any): string;
}

