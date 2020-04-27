import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Code } from '../models/Code';

// here are all the interactions with firebase
@Injectable({
  providedIn: 'root'
})
export class AgencyVisitorService {
  codeCollection: AngularFirestoreCollection<Code>;

  constructor(public afs: AngularFirestore) { }

}

