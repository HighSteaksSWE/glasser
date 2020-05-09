import { Component, OnInit } from '@angular/core';

// Firestore imports 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Observable,of, from, Timestamp } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { NgForm, NgModel } from '@angular/forms';

/*

TODO
1. identify group visits and exclude them from the getStatistics()
2. 
3.

 */

interface  Visit{
  code: number;
}
// interface that defines the agency visit structure
interface  AencyVisit{
  AgencyID: string;
  code: string;
  time: Timestamp<any>;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   // Connect Agency to Firebase collection
   visitCollection: AngularFirestoreCollection<Visit>;
   visits: Observable<Visit[]>;
   totalNumVisits = 0;
   agencyCounterPerID=0;
  //  counterArray ={1:0, 2:0 , 3:0}; //  key represents duplicate or triplit of agencies, value = their number
   // 32 max agency limit per visit - hopefully no one should ever reach this
   counterArray = [0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]   
   multiples = 0;
   mostCommonPair = {};
   mostCommonTriplet = {};
   agencyList = new Array(); 
   IDField: Observable<any>;

   // Percentage calculations
   pctMultipleAgencyVisits: number;

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    console.log("a");
    this.getStatistics();
  }

  getStatistics(): void{
    const visitArray = this.afs.collection("visits").snapshotChanges();
    visitArray.subscribe( payload => {
      payload.forEach( item => {
        const visit = item.payload.doc.data() as Visit;
        console.log("visit = ", visit);

        
        // getting visited frequencies
        const visitedAgencies = this.afs.collection(visit.code.toString()).snapshotChanges();
        visitedAgencies.subscribe( payload => {
          payload.forEach( item => {
            this.totalNumVisits+=1;
            this.agencyCounterPerID+=1;
            const agencyVisit = item.payload.doc.data() as AencyVisit; 
            this.agencyList.push(agencyVisit.AgencyID);
            //console.log("agencyList", this.agencyList);          
            
          });
          
          this.counterArray[this.agencyCounterPerID]+=1;
          //console.log(this.counterArray[this.agencyCounterPerID],"visits for ", this.agencyCounterPerID , "agencies" );

          // getting visited Agenccies based on the agencyCounterPerID
          for(var i = 0;i<this.agencyList.length;i++) { 
            if (this.agencyCounterPerID == 2) {
              var result2 = this.agencyList.hasOwnProperty(this.agencyList[i].toString);
              console.log("result for common pair = ", result2)
              if (result2 == false){
                this.mostCommonPair[this.agencyList[i].toString] =1;
              }
              this.mostCommonPair[this.agencyList[i].toString] +=1;
              console.log("first if , agencyList[i] =", this.agencyList[i],  this.mostCommonPair[this.agencyList[i].toString])
            } else if (this.agencyCounterPerID == 3){
              var result3 = this.agencyList.hasOwnProperty(this.agencyList[i].toString);
              if (result3 == false){
                console.log("result for common triplet = ", result3)
                this.mostCommonTriplet[this.agencyList[i].toString] =1;
              }
              this.mostCommonTriplet[this.agencyList[i]] +=1; 
            }
          }
          for (var i=2; i<this.counterArray.length; i++) {
           this.multiples+= this.counterArray[i];
          }

          // percentages
          this.pctMultipleAgencyVisits = this.totalNumVisits / this.counterArray[2];//this.multiples;
          console.log(this.pctMultipleAgencyVisits);

          this.agencyCounterPerID =0;
          //empty the array
          this.agencyList.length = 0;
      });
    });
  });

  
  // console.log(this.counterArray[1] , " visit for " , 1 , "agencies");
  // console.log(this.counterArray[2] , " visit for " , 2 , "agencies");
  // console.log(this.counterArray[3] , " visit for " , 3 , "agencies");
  console.log("this.mostCommonTriplet", this.mostCommonTriplet);
  console.log("this.mostCommonPair", this.mostCommonPair);

 }
}
