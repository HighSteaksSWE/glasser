import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
//import { Code } from '../models/Code';

@Injectable({
  providedIn: 'root'
})
export class ViewerServiceService {

  constructor(public afs: AngularFirestore) { }
}
